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

  context "RoleCheck core logic" do
    let!(:role) { create(:role, :with_permission_1010) }
    let!(:current_user) {
      res = create(:user)
      res.roles = [role.id]
      res
    }

    it "user can read feature 1010" do
      cmd = RoleCheck.call(current_user, 1010, Constants::PERMISSION_READ)

      expect(cmd.result).to eq true
    end

    it "user can read feature 1020" do
      cmd = RoleCheck.call(current_user, 1020, Constants::PERMISSION_READ)

      expect(cmd.result).to eq true
    end

    it "user can update feature 1020" do
      cmd = RoleCheck.call(current_user, 1020, Constants::PERMISSION_UPDATE)

      expect(cmd.result).to eq true
    end

    it "user can create feature 1020" do
      cmd = RoleCheck.call(current_user, 1020, Constants::PERMISSION_CREATE)

      expect(cmd.result).to eq true
    end

    it "user cannot delete feature 1020" do
      cmd = RoleCheck.call(current_user, 1020, Constants::PERMISSION_DELETE)

      expect(cmd.result).to eq false
    end

    it "user cannot read feature 2000" do
      cmd = RoleCheck.call(current_user, 2000, Constants::PERMISSION_READ)

      expect(cmd.result).to eq false
    end
  end
end
