class Inventory::PlantsController < ApplicationController
  authorize_resource class: false
  before_action :load_facility_strains, only: [:mothers, :cultivation_batches]
  before_action :load_batches, only: [:clones, :vegs, :flowers, :harvest_batches]
  before_action :load_scandit_licence, except: [:cultivation_batches]
  before_action :setup_editor_data, only: [:seeds, :purchased_clones]

  def index
    @strain_types = Constants::STRAIN_TYPES
  end

  def mothers
    facilities = params[:facility_id] == 'All' ? current_shared_facility_ids.map { |x| x.to_s } : current_facility&.id.to_s
    @facility_strains = Inventory::QueryFacilityStrains.call(facilities).result
    if params[:onboarding_type].present?
      current_facility.update_onboarding('ONBOARDING_ACTIVE_PLANTS')
    end
  end

  def cultivation_batches
  end

  def clones
  end

  def vegs
  end

  def flowers
  end

  def harvest_batches
    cultivation_batches = Cultivation::Batch.includes(:facility_strain, :tasks).where(facility_id: params[:facility_id])
    @cultivation_batches = BatchSerializer.new(cultivation_batches, params: {exclude_tasks: true}).serializable_hash[:data]
    @uoms = Common::UnitOfMeasure.where(dimension: 'weight').map &:unit
  end

  # def manicure(batches)
  # end

  def seeds
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
    @uoms = Inventory::Catalogue.seed.uoms.pluck(:unit)
  end

  def purchased_clones
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
    @uoms = Inventory::Catalogue.purchased_clones.uoms.pluck(:unit)
  end

  private

  def load_batches
    if resource_shared?
      facilities = params[:facility_id] == 'All' ? current_shared_facility_ids.map { |x| x.to_s } : current_facility&.id.to_s
      cultivation_batches = Cultivation::Batch.in(facility_id: facilities).includes(:facility_strain, :tasks)
    else
      facility_id = current_facility&.id.to_s
      cultivation_batches = Cultivation::Batch.where(facility_id: facility_id).includes(:facility_strain, :tasks)
    end

    @cultivation_batches = BatchSerializer.new(cultivation_batches, params: {exclude_tasks: true}).serializable_hash[:data]
  end

  def load_facility_strains
    @facility_strains = Inventory::QueryFacilityStrains.call(params[:facility_id]).result
  end

  def load_scandit_licence
    @scanditLicense = ENV['SCANDIT_LICENSE'] || 'AWBsKgHJHZNPG18CMjDOp6YARpP2P9ZpR2Zl8kskc6rmZ7o+RWKD5c1NHDNHHbnq31POoHVBNoB/Q91CR1hmVMM8NXgmZf+LmFY3ZTxMhdxFbxwgdxqj1u18ZLAAQWG8MVUAjKM9OgrrPQtMzwI/xUN0ZaIjLTjQ7i68sYA82p4dsYf3B3bIFi3BR+tItjEzoNxMqOgAiUDMd2qC9eDM79Itx+e3NgqaJ3uc2W7KXWJgVQRUUrgFP1eXaMFoTrSi7D8koF+yQKqTOYPR7V1934ZxFp1Z9PV15H9drhfEJuryQsn1bZiJ3BhlMF7dOCFSoTMQaod0gnUSk4+uBhsdxux4z5iJwzfTuqq0Sa+7/SaILfuVMwcQz4+dDwRsolwsDsMhdeEY5fV9gmds3YNeOCZN2xIp0TFuXuVI/VbBV2Y2n3vt69MKqpYCGdTuZmVUwT5l2XiybcRul18BxUYZaw1SSLybut0+IjVbSpHJmpJXdQjRyKyLrlxJF7q2eimv513ltTjc/v85h5rFc+LKjh/TjS6fypg3NLlHllN1MOGXbIpqzVtajf0UF4x0BdpV49yfn/M0QIuh2cFblqGC8ElhadOaQ2OUtex4m7nIdlkU4TvnvTqjO2NAo+iBt1ySnP8yHDo5CgbKIzOCOek2Q1807QK8UxepOS8lGh+Hf5qe5xILtiR78OlD1euNcPvPjLtp94fthufbKNL37W/7IQe/mfMLffpnER/drhx5dWBBt5kuLVX3EiWdGhZ3MACCG2ZyUYVFqSS8/oTn4UtMW6HErChOftFdVfP709oXe3VHEhYUagfzZ5sX56llWSU='
  end

  def setup_editor_data
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(piece)).pluck(:unit)
  end
end
