module DashboardForm
  class DashboardForm
    attr_accessor :all_facilities, :incomplete_facilities

    def initialize
      @all_facilities = Facility.all.pluck_all('id', :name, :code, :room_count, :is_complete)
      @incomplete_facilities = all_facilities.select { |f| f['is_complete'] == false }
      # @have_incomplete_facility = @incomplete_facilities.any?
    end
  end
end
