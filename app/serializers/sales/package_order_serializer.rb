module Sales
  class PackageOrderSerializer
    include FastJsonapi::ObjectSerializer

    attributes :order_no, :status

    attribute :use_type do |x|
      'Medical'
    end

    attribute :fulfilment_date do |x|
      ''
    end

    attribute :delivery_date do |x|
      ''
    end

    attribute :total_items_ordered do |x|
      ''
    end

    attribute :order_date do |x|
      x.created_at.strftime('%d %b %Y')
    end

    attribute :total_net_weight do |x|
      ''
    end

    attribute :total_revenue do |x|
      ''
    end

    attribute :customer do |x|
      'ABC Distributor'
    end

    attribute :manifest do |x|
      ''
    end

    # attribute :harvest_packages do |object|
    #   object.harvest_packages.map do |x|
    #     {
    #       url: x.file.url,
    #       preview: x.file.url, # TODO: need a resizer...
    #       type: x.file_mime_type,
    #     }
    #   end
    # end

  end
end
