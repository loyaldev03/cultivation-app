class Settings::Batches::TemplatesController < ApplicationController
  def index
    @batches = Cultivation::Batch.where(is_template: true)
  end

  def edit
    @record = Cultivation::Batch.find(params[:id])
  end

  def update
    @record = Cultivation::Batch.find(params[:id])
    if @record.update(template_name: params[:record][:template_name])
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
    @record = Cultivation::Batch.find(params[:id])
    @record.update(is_template: false)
    redirect_to settings_batch_templates_path
  end
end
