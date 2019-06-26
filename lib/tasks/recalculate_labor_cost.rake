task recalculate_labor_cost:, :batch_id => :environment  do |t, args|
  batch = Cultivation::Batch.find(args[:batch_id])
  batch_tasks = Cultivation::QueryTasks.call(batch, [:modifier, :users]).result
  batch_tasks.each do |t|
    task = get_task(batch_tasks, t.id)
    facility_users = QueryUsers.call(batch.facility_id).result
    update_estimated_cost(task, batch_tasks, facility_users)
    update_parent_cascade(task, batch_tasks)
    task.save!
  end
end

def update_estimated_cost(task, batch_tasks, users)
  if task.have_children?(batch_tasks)
    children = task.children(batch_tasks)
    task.estimated_hours = sum_children_hours(children, batch_tasks)
    task.estimated_labor_cost = sum_children_labor_cost(children, batch_tasks)

    # TASK 980
    task.estimated_material_cost = sum_children_est_material_cost(children, batch_tasks)
    return
  end

  if task.estimated_hours && task.duration && task.user_ids.present?
    hours_per_person = task.estimated_hours / task.user_ids.length
    estimated_labor_cost = 0.00
    task.user_ids.each do |user_id|
      user = users.detect { |u| u.id == user_id }
      if user.present?
        estimated_labor_cost += user.hourly_rate * hours_per_person
      else
        # Remove user from task if not found
        task.user_ids.delete_if { |i| i == user_id }
      end
    end
    task.estimated_labor_cost = estimated_labor_cost
  else
    task.estimated_labor_cost = 0
  end
end

def sum_children_hours(children, batch_tasks)
  children.reduce(0) do |sum, e|
    if !e.have_children?(batch_tasks) && e.estimated_hours
      sum + e.estimated_hours
    else
      sum
    end
  end
end

def sum_children_labor_cost(children, batch_tasks)
  children.reduce(0.0) do |sum, e|
    if !e.have_children?(batch_tasks) && e.estimated_labor_cost
      sum + e.estimated_labor_cost
    else
      sum
    end
  end
end

def sum_children_est_material_cost(children, batch_tasks)
  children.reduce(0.0) do |sum, e|
    if !e.have_children?(batch_tasks) && e.estimated_material_cost
      sum + e.estimated_material_cost
    else
      sum
    end
  end
end

def decide_duration(task, parent, children)
  if parent.end_date < task.end_date
    # Extend parent duration / end_date
    (task.end_date - parent.start_date) / 1.day
  else
    # Contract parent duration / end_date
    max_child_date = children.map(&:end_date).compact.max
    (max_child_date - parent.start_date) / 1.day
  end
end

def update_parent_cascade(task, batch_tasks)
  parent = task.parent(batch_tasks)
  while parent.present?
    update_parent_fields(task, parent, batch_tasks)
    parent = parent.parent(batch_tasks)
  end
end

def update_parent_fields(task, parent, batch_tasks)
  children = parent.children(batch_tasks)
  parent.estimated_hours = sum_children_hours(children, batch_tasks)
  parent.estimated_labor_cost = sum_children_labor_cost(children, batch_tasks)
  parent.estimated_material_cost = sum_children_est_material_cost(children, batch_tasks)
  parent.save
end

def get_task(tasks, task_id)
  tasks.detect { |t| t.id == task_id.to_bson_id }
end


