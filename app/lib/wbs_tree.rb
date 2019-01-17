class WbsTree
  class << self
    def generate(tasks = [])
      max_indent = tasks.max_by(&:indent)
      nodes = Array.new(max_indent.indent * 2, 0)
      prev_indent = 0

      tasks.map do |t|
        nodes[t.indent] += 1

        if t.indent < prev_indent
          for i in (t.indent...nodes.length)
            nodes[i + 1] = 0
          end
        end

        prev_indent = t.indent
        wbs = nodes.reject(&:zero?).join('.')

        {
          id: t.id.to_s,
          wbs: wbs,
        }
      end
    end

    def child_of?(node_wbs, predecessor_wbs, tasks_with_wbs = [])
      p = parent(tasks_with_wbs, node_wbs)
      while p.present?
        if p.wbs == predecessor_wbs
          return true
        end
        p = parent(tasks_with_wbs, p.wbs)
      end
      false
    end

    def have_children?(node_wbs = '', tasks_with_wbs = [])
      child_wbs = node_wbs + '.'
      tasks_with_wbs.any? { |t| t.wbs.starts_with? child_wbs }
    end

    def children(tasks_with_wbs = [], node_wbs = '')
      child_wbs = node_wbs + '.'
      tasks_with_wbs.select { |t| t.wbs.starts_with? child_wbs }
    end

    def parent(tasks_with_wbs = [], node_wbs = '')
      if !node_wbs.blank? && !tasks_with_wbs.blank?
        last_index = node_wbs.rindex('.')
        if last_index.nil?
          nil
        else
          parent_wbs = node_wbs[0...last_index]
          tasks_with_wbs.detect { |t| t.wbs == parent_wbs }
        end
      end
    end
  end
end
