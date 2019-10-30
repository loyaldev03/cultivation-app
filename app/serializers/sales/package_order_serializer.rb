module Sales
  class PackageOrderSerializer
    include FastJsonapi::ObjectSerializer

    attributes :order_no, :status

    attribute :use_type do |x|
      'Medical'
    end

    attribute :fulfilment_date do |x|
      ['2 Nov 2019', '3 Nov 2019', '4 Nov 2019'].sample
    end

    attribute :delivery_date do |x|
      ['9 Nov 2019', '10 Nov 2019', '11 Nov 2019'].sample
    end

    attribute :total_items_ordered do |x|
      rand(1..100)
    end

    attribute :order_date do |x|
      x.created_at.strftime('%d %b %Y')
    end

    attribute :total_net_weight do |x|
      rand(20..150)
    end

    attribute :total_revenue do |x|
      num = rand(1000..9000)
      "$#{num}"
    end

    attribute :customer do |x|
      x.customer.name
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
