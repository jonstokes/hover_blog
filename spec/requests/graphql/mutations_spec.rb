require 'rails_helper'

RSpec.describe "GraphQL Mutations", type: "request" do
  let(:endpoint) { "/graphql" }
  let(:json) { JSON.parse(response.body)["data"] }

  describe "AddFeatureMutation" do
    let(:query) {
      <<-GRAPHQL
        mutation($input: AddFeatureInput!) {
          addFeature(input: $input) {
            clientMutationId,
            featureEdge {
              node {
                id
                name
                description
                url
              }
            }
          }
        }
      GRAPHQL
    }
    let(:variables) {
      <<-JSON
        {
          "input": {
            "name": "Foo",
            "description": "Bar",
            "url": "baz"
          }
        }
      JSON
    }

    it "adds a feature" do
      post(endpoint, params: { query: query, variables: variables })

      expect(json["addFeature"]).not_to be_empty
      expect(json["addFeature"]["featureEdge"]["node"]).to eq({
        "id" => "9",
        "name" => "Foo",
        "description" => "Bar",
        "url" => "baz"
      })
    end
  end
end