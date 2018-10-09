require 'rails_helper'

RSpec.describe RoleCheck do
  context "Verify App Modules & Permission Constants" do
    it "Constants Permission should exists" do
      expect(Constants::PERMISSION_NONE).to eq 0
      expect(Constants::PERMISSION_READ).to eq 1
      expect(Constants::PERMISSION_UPDATE).to eq 2
      expect(Constants::PERMISSION_CREATE).to eq 4
      expect(Constants::PERMISSION_DELETE).to eq 8
    end

    it "Constatns AppModules should exists" do
      expect(Constants::APP_MODULES[0][:name]).to eq "Finance"
      expect(Constants::APP_MODULES[1][:name]).to eq "Inventory"
      expect(Constants::APP_MODULES[2][:name]).to eq "Cultivation"
      expect(Constants::APP_MODULES[3][:name]).to eq "Issues"
    end
  end

  context "Invalid Call Exceptions" do
    it "should return exception Missing current user" do
      expect { RoleCheck.call(nil, nil, nil) }.to raise_error(ArgumentError, 'Missing "current_user"')
    end

    it "should return exception Missing feature" do
      expect { RoleCheck.call({ id: "1"}, nil, nil) }.to raise_error(ArgumentError, 'Missing "feature"')
    end

    it "should return exception Missing permissions" do
      expect { RoleCheck.call({ id: "1" }, 1000, nil) }.to raise_error(ArgumentError, 'Missing "permissions"')
    end
  end
end
