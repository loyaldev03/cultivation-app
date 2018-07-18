class Purchasing::VendorsController < ApplicationController
  def index
    @records = QueryVendor.call.result
  end

  def new
    @record = PurchasingForm::VendorForm.new
  end

  def create
    @record = PurchasingForm::VendorForm.new
    if @record.submit(record_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  def edit
    @record = PurchasingForm::VendorForm.new(params[:id])
  end

  def update
    form_object = PurchasingForm::VendorForm.new(params[:id])
    if form_object.submit(update_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'edit', layout: nil
    end
  end

  def destroy
    command = DestroyVendor.call(params[:id])
    if command.success?
      render 'layouts/hide_sidebar', layouts: nil
    else
      flash[:error] = 'Unable to delete'
      render 'edit', layout: nil
    end
  end

  private

  def record_params
    params.require(:record).permit(:name)
  end

  def update_params
    {id: params[:id]}.merge(record_params)
  end
end
