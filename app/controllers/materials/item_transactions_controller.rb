# TODO: This is outdated!
class Materials::ItemTransactionsController < ApplicationController
  def new
    @record = MaterialsForm::ItemTransactionForm.new
  end

  def create
    @record = MaterialsForm::ItemTransactionForm.new
    if @record.submit(record_params)
      render 'layouts/hide_sidebar', layouts: nil
    else
      render 'new', layout: nil
    end
  end

  private

  def record_params
    params.require(:record).permit(:quantity, :uom, :trans_type, :item_id)
  end
end
