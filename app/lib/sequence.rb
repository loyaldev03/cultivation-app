class Sequence
  class << self
    def facility_code_format
      return 'F%02d'
    end

    def room_code_format
      return 'M%02d'
    end

    def section_code_format
      return 'SEC%02d'
    end

    def row_code_format
      return 'R%02d'
    end

    def shelf_code_format
      return 'S%02d'
    end

    def tray_code_format
      return 'T%02d'
    end

    def batch_code_format
      return 'B%02d'
    end
  end
end
