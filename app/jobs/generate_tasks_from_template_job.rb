class GenerateTasksFromTemplateJob < ApplicationJob
  queue_as :default

  def perform(batch_id)
    batch = Cultivation::Batch.find_by(id: batch_id)
    new_tasks = generate_tasks(batch, get_tasks_from_template)

    # Insert task to database
    Cultivation::Task.create(new_tasks)

    # Set harvest date
    batch.estimated_harvest_date = get_harvest_date(new_tasks)
    batch.save!
  end

  private

  def get_tasks_from_template
    template_path = 'lib/cultivation_templates/template3.json'
    JSON.parse(File.read(template_path), symbolize_names: true)
  end

  def generate_tasks(batch, template_tasks)
    # Temporary variables
    start_date = batch.start_date
    end_date = nil
    parent = Array.new(10) # Maximum 20 level depth
    new_tasks = []

    # Loop through each task from template
    template_tasks.each do |task|
      new_task = build_task(task, start_date, end_date)
      new_task[:id] = BSON::ObjectId.new
      task[:id] = new_task[:id] # Put the id into the template too
      new_task[:batch_id] = batch.id

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

      # Keep new tasks in an array
      new_tasks << new_task
    end

    new_tasks
  end

  def get_task_id_by_wbs(template_tasks, predecessor_wbs)
    predecessor = template_tasks.detect { |t| t[:wbs] == predecessor_wbs }
    predecessor[:id] if predecessor.present?
  end

  def set_move_task_defaults(task)
    task[:task_type] = ['move_plant']
  end

  def build_task(task, parent_start_date, parent_end_date)
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
