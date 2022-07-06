import { createServer } from "@graphql-yoga/node";
import { gql } from "graphql-tag";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const typeDefs = gql`
  type Query {
    types: [Type!]!
    type(id: ID!): Type!
  }

  type Type {
    id: ID!
    name: String
  }
`;

const types = yaml.load(
  fs.readFileSync(
    path.join(process.cwd(), "public", "sde", "fsd", "typeIDs.yaml"),
    "utf8"
  )
);

const resolvers = {
  Query: {
    type: (_, { id }) => {
      return {
        id,
        name: types[id].name.en,
      };
    },
    types: () => {
      return Object.keys(types).map((id) => ({ id, name: types[id].name.en }));
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: "/api/graphql",
  // graphiql: false // uncomment to disable GraphiQL
});

export default server;
