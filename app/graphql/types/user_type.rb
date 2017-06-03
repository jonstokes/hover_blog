Types::UserType = GraphQL::ObjectType.define do
  name "User"
  field :id, !types.ID
  field :username, !types.String
  field :website, !types.String
  connection :features, FeatureType.connection_type do
    resolve ->(user, args, ctx) {
      Database.get_features
    }
  end
end
