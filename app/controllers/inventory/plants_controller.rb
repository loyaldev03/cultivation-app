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
    @facility_strains = Inventory::QueryFacilityStrains.call(
      selected_facilities_ids,
    ).result
    if params[:onboarding_type].present?
      current_user_facilities.each do |f|
        f.update_onboarding('ONBOARDING_ACTIVE_PLANTS')
      end
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
    @facility_strains = Inventory::QueryFacilityStrains.call(selected_facilities_ids).result
    @uoms = Inventory::Catalogue.seed.uoms.pluck(:unit)
  end

  def purchased_clones
    @facility_strains = Inventory::QueryFacilityStrains.call(selected_facilities_ids).result
    @uoms = Inventory::Catalogue.purchased_clones.uoms.pluck(:unit)
  end

  private

  def load_batches
    cultivation_batches = Cultivation::Batch.
      includes(:facility_strain, :plants).
      in(facility_id: selected_facilities_ids)
    @cultivation_batches = BatchSerializer.
      new(cultivation_batches, params: {exclude_tasks: true}).
      serializable_hash[:data]
  end

  def load_facility_strains
    @facility_strains = Inventory::QueryFacilityStrains.call(
      selected_facilities_ids,
    ).result
  end

  def load_scandit_licence
    @scanditLicense = ''
  end

  def setup_editor_data
    @order_uoms = Common::UnitOfMeasure.where(:dimension.in => %w(piece)).pluck(:unit)
  end
end
