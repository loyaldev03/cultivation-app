class QueryAvailableTrays
  prepend SimpleCommand

  attr_reader :facility_id, :start_date, :end_date

  def initialize(facility_id, start_date, end_date)
    raise ArgumentError, 'start_date' if start_date.nil?
    raise ArgumentError, 'end_date' if end_date.nil?
    raise ArgumentError, 'start_date should be ealier than end_date' if end_date <= start_date
    
    @facility_id = facility_id
    @start_date = start_date.beginning_of_day
    @end_date = end_date.end_of_day
  end

  def call
    query_records
  end

  private

  def query_records
    result = Facility.collection.aggregate [
      { "$project": { _id: 0, facility_id:"$_id", facility_code:"$code", facility_name:"$name", rooms:1 } },
      { "$unwind": "$rooms" },
      { "$unwind": "$rooms.rows" },
      { "$unwind": "$rooms.rows.shelves" },
      { "$match": {
          "$and": [
            { "rooms.is_complete": true },
            { "rooms.rows.shelves.is_complete": true }
          ]
        }
      },
      { "$lookup": {
          from: "facilities",
          let: { "sectionId": "$rooms.rows.section_id" },
          pipeline: [
            { "$unwind": "$rooms" },
            { "$unwind": "$rooms.sections" },
            { "$match": { "$expr": { "$eq": ["$rooms.sections._id", "$$sectionId"] } } },
            { "$project": { _id:0, section_id: "$rooms.sections._id", section_name: "$rooms.sections.name" } }
          ],
          as: "section"
        }
      },
      { "$unwind": { path: "$section", preserveNullAndEmptyArrays: true } },
      { "$lookup": {
          from: "trays",
          localField: "rooms.rows.shelves._id",
          foreignField: "shelf_id",
          as: "trays"
        }
      },
      { "$unwind": "$trays" },
      { "$match": { "trays.capacity": { "$ne": nil } } },
      { "$lookup": {
          from: "cultivation_tray_plans",
          let: {
            "trayId": "$trays._id",
            "startDate": @start_date,
            "endDate": @end_date,
          },
          pipeline: [
            { "$match": { "$expr": { "$eq": ["$tray_id", "$$trayId"] } } },
            { "$match": {
                "$expr": {
                  "$or":[
                    { "$and":[ { "$gt": ["$end_date", "$$startDate"] }, { "$lte": ["$end_date", "$$endDate"] } ] },
                    { "$and":[ { "$gte": ["$start_date", "$$startDate"] }, { "$lt": ["$start_date", "$$endDate"] } ] },
                    { "$and":[ { "$lte": ["$start_date", "$$startDate"] }, { "$gte": ["$end_date", "$$endDate"] } ] }
                  ]
                }
              }
            },
            { "$project": { capacity: "$capacity", start_date: "$start_date", end_date: "$end_date" } }
          ],
          as: "planned"
        }
      },
      { "$addFields": {
          "planned_capacity": { "$sum": "$planned.capacity" }
        }
      },
      { "$addFields": {
          "remaining_capacity": { "$subtract": [ "$trays.capacity", "$planned_capacity" ] }
        }
      },
      { "$project":
        {
          facility_id: 1,
          facility_code: 1,
          facility_name: 1,
          room_id: "$rooms._id",
          room_is_complete: "$rooms.is_complete",
          room_name: "$rooms.name",
          room_code: "$rooms.code",
          room_purpose: "$rooms.purpose",
          row_id: "$rooms.rows._id",
          row_name: "$rooms.rows.name",
          row_code: "$rooms.rows.code",
          section_id: "$section.section_id",
          section_name: "$section.section_name",
          shelf_id: "$rooms.rows.shelves._id",
          shelf_code: "$rooms.rows.shelves.code",
          shelf_name: "$rooms.rows.shelves.name",
          tray_id: "$trays._id",
          tray_code: "$trays.code",
          tray_capacity: "$trays.capacity",
          tray_capacity_type: "$trays.capacity_type",
          planned: 1,
          planned_capacity: 1,
          remaining_capacity: 1,
        }
      }
    ]

    #result.to_a
    result
  end
end
