require 'rails_helper'

RSpec.describe "GraphQL Types" do
  let(:endpoint) { "/graphql" }
  let(:json) { JSON.parse(response.body)["data"] }

  describe "UserType" do
    let(:query) {
      <<-GRAPHQL
        {
          viewer {
            id
            features {
              edges {
                node {
                  id
                  name
                  description
                  url
                }
              }
            }
          }
        }
      GRAPHQL
    }

    it "returns a user" do
      post(endpoint, params: { query: query }  )

      expect(json["viewer"].keys).to eq(%w(id features))
      expect(json["viewer"]["id"]).to eq("1")
      expect(json["viewer"]["features"]["edges"].count).to eq(8)
    end
  end
end