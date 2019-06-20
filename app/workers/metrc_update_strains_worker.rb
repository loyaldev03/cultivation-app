class MetrcUpdateStrainsWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'low'

  def perform(facility_id)
    # Overview of the logic flow
    # Get strains from API (1)
    # Get strains from db (2)
    # When found new strains in (2)
    #   call create strain api
    # When found existing strains
    #   call update strains api

    facility = Facility.find(facility_id)
    remote_strains = MetrcApi.get_strains(facility.site_license) # Hash format
    remote_strains_name = remote_strains.map { |s| s['Name'] }
    local_strains = facility.strains.to_a # Ruby object format
    local_strains_name = local_strains.map(&:strain_name)
    new_strains_name = local_strains_name - remote_strains_name

    # Create new strains in Metrc
    create_strains_on_metrc(facility.site_license,
                            new_strains_name,
                            local_strains)

    # Detect changes and update in Metrc
    # update_strains_on_metrc(facility.site_license,
    #                         local_strains,
    #                         remote_strains)

    # Update Metrc Id to local record
    # update_local_metrc_ids(facility.site_license,
    #                        local_strains)
  end

  def create_strains_on_metrc(site_license, new_strains_name, local_strains)
    if new_strains_name.any?
      new_strains_name.each do |s|
        found = local_strains.detect { |i| i.strain_name == s }
        if found&.metrc_id.nil?
          # Only create new strain in when no metrc_id
          params = {
            "Name": found.strain_name,
            "TestingStatus": 'None',
            "ThcLevel": found.thc,
            "CbdLevel": found.cbd,
            "IndicaPercentage": found.indica_makeup&.to_f,
            "SativaPercentage": found.sativa_makeup&.to_f,
          }
          MetrcApi.create_strains(site_license, params)
        end
      end
    end
  end

  def update_strains_on_metrc(site_license, local_strains, remote_strains)
    if local_strains.any?
      local_strains.each do |s|
        found = remote_strains.detect { |i| i['Name'] == s.strain_name }
        if found && s.metrc_id
          params = {
            "Id": s.metrc_id,
            "Name": s.strain_name,
            "TestingStatus": 'None',
            "ThcLevel": s.thc,
            "CbdLevel": s.cbd,
            "IndicaPercentage": s.indica_makeup&.to_f,
            "SativaPercentage": s.sativa_makeup&.to_f,
          }
          MetrcApi.update_strains(site_license, params)
        end
      end
    end
  end

  def update_local_metrc_ids(site_license, local_strains)
    remote_strains = MetrcApi.get_strains(site_license) # Hash format
    if local_strains.any?
      local_strains.each do |s|
        found = remote_strains.detect { |i| i['Name'] == s.strain_name }
        if found
          s.metrc_id = found['Id']
          s.save
        end
      end
    end
  end
end
