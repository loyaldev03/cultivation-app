class Materials::ItemsController < ApplicationController
  def index
    @records = QueryItems.call.result
  end

  def new
    @record = MaterialsForm::ItemForm.new
  end

  def create
    @record = MaterialsForm::ItemForm.new
    if @record.submit(record_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def edit
    @record = MaterialsForm::ItemForm.new(params[:id])
  end

  def update
    form_object = MaterialsForm::ItemForm.new(params[:id])
    update_params = {id: params[:id]}.merge(record_params)
    if form_object.submit(update_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
    command = DestroyItem.call(params[:id])
    if command.success?
      render 'layouts/hide_sidebar', layouts: nil
    else
      flash[:error] = 'Unable to delete'
      render 'edit', layout: nil
    end
  end

  private

  def record_params
    params.require(:record).permit(:name, :description, :facility)
  end
end
