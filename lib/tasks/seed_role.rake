desc "Create basic user roles"
task seed_roles: :environment do
  if Common::Role.count == 0
    Common::Role.create!([
      { name: "Super Admin", built_in: true },
      # { name: "Admin" },
      # { name: "Book Keeper" },
      # { name: "Business Manager" },
      # { name: "Business Owner" },
      # { name: "Extraction Supervisor" },
      # { name: "Gardener" },
      # { name: "Inventory Supervisor" },
      # { name: "Lab Assistant" },
      # { name: "Packager" },
      # { name: "Supervisors" },
    ])
  end
end
