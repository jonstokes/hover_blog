HoverBlogSchema = GraphQL::Schema.define do
  query(Types::QueryType)

  id_from_object ->(object, type_definition, query_ctx) {
    # Call your application's UUID method here
    # It should return a string
    GraphQL::Schema::UniqueWithinType.encode(type_definition.name, object.id)
  }

  object_from_id ->(id, query_ctx) {
    type_name, item_id = GraphQL::Schema::UniqueWithinType.decode(id)

    Database.send("get_#{type_name}", item_id)
  }
end
