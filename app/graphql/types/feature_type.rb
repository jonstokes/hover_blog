Types::FeatureType = GraphQL::ObjectType.define do
  name "User"
  field :id, !types.ID
  field :name, !types.String
  field :description, !types.String
  field :url, !types.String
end
