class GenerateWbs
  class << self
    def generate(tasks = [])
      nodes = Array.new(10, 0)
      prev_indent = 0

      tasks.map do |t|
        nodes[t.indent] += 1

        if t.indent < prev_indent
          for i in (t.indent...nodes.length)
            nodes[i + 1] = 0
          end
        end

        prev_indent = t.indent

        {
          id: t.id.to_s,
          wbs: nodes.reject(&:zero?).join('.'),
        }
      end
    end
  end
end
