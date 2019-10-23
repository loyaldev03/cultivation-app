class GenerateTasksFromTemplateJob < ApplicationJob
  queue_as :default

  def perform(batch_id)
    phases = Common::GrowPhase.where(is_active: true).pluck(:name)
    batch = Cultivation::Batch.find_by(id: batch_id)
    new_tasks = generate_tasks(
      batch,
      get_tasks_from_template(batch, phases),
    )

    # Insert task to database
    Cultivation::Task.collection.insert_many(new_tasks)

    # Set harvest date
    batch.estimated_harvest_date = get_harvest_date(new_tasks)
    batch.save!
    batch
  end

  private

  def get_tasks_from_template(batch, phases)
    template_path = "lib/cultivation_templates/#{batch.batch_source}.json"
    res = JSON.parse(File.read(template_path), symbolize_names: true)

    if phases.blank?
      res
    else
      res.select { |x| phases.include? x[:phase] }
    end
  end

  def generate_tasks(batch, template_tasks)
    # Temporary variables
    start_date = batch.start_date.beginning_of_day
    end_date = nil
    parent = Array.new(10) # Maximum indent depth
    new_tasks = []

    # Loop through each task from template and generate Hash array of all
    # tasks
    template_tasks.each_with_index do |task, idx|
      new_task = build_task(task, start_date, end_date, batch)
      new_task[:id] = BSON::ObjectId.new
      task[:id] = new_task[:id] # Important: needed by get_task_id_by_wbs
      new_task[:batch_id] = batch.id
      new_task[:batch_name] = batch.name
      new_task[:batch_status] = batch.status
      new_task[:assignable] = !have_children?(template_tasks, task[:wbs])
      new_task[:position] = idx
      # Remember current node for next iteration
      parent[new_task[:indent]] = new_task[:id]

      # Set predecessor using wbs
      if task[:predecessor].present?
        new_task[:depend_on] = get_task_id_by_wbs(template_tasks,
                                                  task[:predecessor])
      end

      # Reset start & end date when indent level is 0
      if new_task[:indent].zero?
        start_date = new_task[:start_date]
        end_date = new_task[:end_date]
      end

      # Keep new task in array (of Hash)
      new_tasks << new_task
    end
    new_tasks
  end

  def get_task_id_by_wbs(template_tasks, predecessor_wbs)
    predecessor = template_tasks.detect { |t| t[:wbs] == predecessor_wbs }
    predecessor[:id] if predecessor.present?
  end

  def have_children?(template_tasks, task_wbs)
    child_wbs = task_wbs + '.'
    template_tasks.any? { |t| t[:wbs].starts_with? child_wbs }
  end

  def build_task(task, parent_start_date, parent_end_date, batch)
    raise ArgumentError, 'start_date is required' if parent_start_date.nil?

    indent = task[:wbs].split('.').length - 1
    duration = task[:duration].present? ? task[:duration].to_i : 1
    task_start_date = if indent.zero?
                        parent_end_date || parent_start_date
                      else
                        parent_start_date
                      end
    task_end_date = task_start_date + duration.days
    record = {
      phase: task[:phase],
      name: task[:name],
      duration: duration,
      start_date: task_start_date,
      end_date: task_end_date,
      indelible: task[:indelible],
      indent: indent,
      facility_id: batch.facility_id,
    }
    record
  end

  def get_harvest_date(tasks)
    harvest_task = tasks.detect { |t| t[:phase] == Constants::CONST_HARVEST }
    # Incase 'harvest' phase not found, fallback to :dry then :cure
    harvest_task ||= tasks.detect { |t| t[:phase] == Constants::CONST_DRY }
    harvest_task ||= tasks.detect { |t| t[:phase] == Constants::CONST_CURE }
    harvest_task[:start_date]
  end
end
