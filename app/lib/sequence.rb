class Sequence
  class << self
    def facility_code_format
      'F%02d'
    end

    def room_code_format
      'M%02d'
    end

    def section_code_format
      'SEC%02d'
    end

    def row_code_format
      'R%02d'
    end

    def shelf_code_format
      'S%02d'
    end

    def tray_code_format
      'T%02d'
    end

    def batch_code_format
      'B%02d'
    end
  end
end
