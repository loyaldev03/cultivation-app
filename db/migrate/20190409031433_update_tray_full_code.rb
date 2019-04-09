class UpdateTrayFullCode < Mongoid::Migration
  def self.up
    facilities = Facility.all
    facilities.each do |f|
      form_object = FacilityWizardForm::BasicInfoForm.new(f.id)
      save_cmd = SaveFacility.call(form_object, User.first)
      if save_cmd.success?
        pp "Updated #{form_object.name}."
      else
        pp "#{form_object.name} not updated."
      end
    end
  end

  def self.down
    # elided
  end
end
