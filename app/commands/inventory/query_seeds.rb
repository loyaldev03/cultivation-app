module Inventory
  class QuerySeeds
    prepend SimpleCommand
    attr_reader :args, :metadata

    SeedInfo = Struct.new(
      :id,
      :order_quantity,
      :order_uom,
      :quantity,
      :uom,
      :product_name,
      :invoice_number,
      :po_number,
      :supplier,
      :facility_name,
      :strain_name,
      :cost,
      :currency
    )

    def initialize(facility_id, args = {})
      args = {
        page: 0,
        limit: 20,
        search: nil,
      }.merge(args)

      @facility_id = facility_id
      @catalogue_type = args[:catalogue_type]
      @event_types = args[:event_types]
      @limit = args[:limit].to_i
      @page = args[:page].to_i
      @search = args[:search]

      special_type = ['seeds', 'purchased_clones']
      @raw_material_ids = if special_type.include?(@catalogue_type)
                            #find parent only one
                            Inventory::Catalogue.raw_materials.where(
                              key: @catalogue_type,
                            ).pluck(:id)
                          else
                            #find catalogue for other than parent, parent will never have category type
                            Inventory::Catalogue.raw_materials.where(
                              category: @catalogue_type,
                            ).pluck(:id)
                          end
    end

    def call
      seeds = Inventory::ItemTransaction.collection.aggregate([
        {"$sort": {"c_at": -1}},
        match_facility,
        match_event_types,
        match_raw_materials,
        {"$lookup": {from: 'facilities',
                     localField: 'facility_id',
                     foreignField: '_id',
                     as: 'facility'}},
        {"$unwind": {
          "path": '$facility',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'inventory_facility_strains',
                     localField: 'facility_strain_id',
                     foreignField: '_id',
                     as: 'facility_strain'}},
        {"$unwind": {
          "path": '$facility_strain',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'inventory_vendor_invoice_items',
                     localField: 'ref_id',
                     foreignField: '_id',
                     as: 'vendor_invoice_item'}},
        {"$unwind": {
          "path": '$vendor_invoice_item',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'inventory_products',
                     localField: 'product_id',
                     foreignField: '_id',
                     as: 'product'}},
        {"$unwind": {
          "path": '$product',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {
          "from": 'inventory_facility_strains',
          "let": {"strain_id": '$product.facility_strain_id'},
          "pipeline": [
            {
              "$match": {
                "$expr": {
                  "$and": [
                    {"$eq": ['$_id', '$$strain_id']},
                  ],
                },
              },
            },
          ],
          "as": 'strain',
        }},
        {"$unwind": {
          "path": '$strain',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {from: 'inventory_catalogues',
                     localField: 'catalogue_id',
                     foreignField: '_id',
                     as: 'catalogue'}},
        {"$unwind": {
          "path": '$catalogue',
          "preserveNullAndEmptyArrays": true,
        }},

        {"$lookup": {
          "from": 'inventory_vendor_invoices',
          "let": {"invoice_id": '$vendor_invoice_item.invoice_id'},
          "pipeline": [
            {
              "$match": {
                "$expr": {
                  "$and": [
                    {"$eq": ['$_id', '$$invoice_id']},
                  ],
                },
              },
            },
          ],
          "as": 'invoice',
        }},
        {"$unwind": {
          "path": '$invoice',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {
          "from": 'inventory_vendors',
          "let": {"vendor_id": '$invoice.vendor_id'},
          "pipeline": [
            {
              "$match": {
                "$expr": {
                  "$and": [
                    {"$eq": ['$_id', '$$vendor_id']},
                  ],
                },
              },
            },
          ],
          "as": 'vendor',
        }},
        {"$unwind": {
          "path": '$vendor',
          "preserveNullAndEmptyArrays": true,
        }},
        {"$lookup": {
          "from": 'inventory_purchase_orders',
          "let": {"purchase_order_id": '$invoice.purchase_order_id'},
          "pipeline": [
            {
              "$match": {
                "$expr": {
                  "$and": [
                    {"$eq": ['$_id', '$$purchase_order_id']},
                  ],
                },
              },
            },
          ],
          "as": 'purchase_order',
        }},
        {"$unwind": {
          "path": '$purchase_order',
          "preserveNullAndEmptyArrays": true,
        }},

        match_search,
        {"$project": {
          "order_quantity": 1,
          "order_uom": 1,
          "quantity": 1,
          "uom": 1,
          "manufacturer": 1,
          "description": 1,
          "conversion": 1,
          "product_name": 1,
          "product_id": 1,
          "product": 1,
          "facility_id": 1,
          "facility_name": '$facility.name',
          "catalogue_id": 1,
          "catalogue": '$catalouge.label',
          "location_id": 1,
          "vendor_invoice_item": 1,
          "invoice_no": '$invoice.invoice_no',
          "vendor_name": '$vendor.name',
          "purchase_order_no": '$purchase_order.purchase_order_no',
          "strain_name": '$strain.strain_name',
        }},
        {"$facet": {
          metadata: [
            {"$count": 'total'},
            {"$addFields": {
              page: @page,
              pages: {"$ceil": {"$divide": ['$total', @limit]}},
              skip: skip,
              limit: @limit,
            }},
          ],
          data: [
            {"$skip": skip},
            {"$limit": @limit},
          ],
        }},

      ])
      result = seeds.to_a[0]
      @metadata = result['metadata'][0]
      json_data = []

      result['data'].each do |x|

        # invoice = Inventory::VendorInvoice.find(x[:invoice_id])
        # product = Inventory::Product.find(x[:product_id])

        item_price = if x[:vendor_invoice_item][:price].is_a?(String)
                       x[:vendor_invoice_item][:price].to_i
                     else
                       x[:vendor_invoice_item][:price]
                     end
        order_quantity = if x[:order_quantity].is_a?(String)
                           x[:order_quantity].to_f
                         else
                           x[:order_quantity]
                         end
        cost = (item_price.to_f * order_quantity.to_f)

        seeds_info = SeedInfo.new(
          x[:_id].to_s,
          x[:order_quantity],
          x[:order_uom],
          x[:quantity],
          x[:uom],
          x[:product_name],
          x[:invoice_no],
          x[:purchase_order_no],
          x[:vendor_name],
          x[:facility_name],
          x[:strain_name],
          cost,
          x[:vendor_invoice_item][:currency]

        )

        json_data << {
          id: x[:_id]&.to_s,
          type: 'raw_material',
          attributes: seeds_info,

        }
      end
      new_seed_info = {
        metadata: @metadata,
        data: json_data,
      }

      new_seed_info
    end

    def match_facility
      {"$match": {"facility_id": {"$in": @facility_id}}}
    end

    def match_search
      if @search.present?
        {"$match": {"$or": [
          {"product_name": Regexp.new(@search, Regexp::IGNORECASE)},
          {"purchase_order.purchase_order_no": Regexp.new(@search, Regexp::IGNORECASE)},
          {"invoice.invoice_no": Regexp.new(@search, Regexp::IGNORECASE)},
        ]}}
      else
        {"$match": {}}
      end
    end

    def match_event_types
      {"$match": {"event_type": {"$in": @event_types}}}
    end

    def match_raw_materials
      {"$match": {"catalogue_id": {"$in": @raw_material_ids}}}
    end

    def skip
      @skip ||= (@page * @limit)
    end
  end
end
