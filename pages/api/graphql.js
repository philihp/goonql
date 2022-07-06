import { createServer } from "@graphql-yoga/node";

const typeDefs = gql`
  type Query {
    type(id: ID!): Type!
  }

  type Type {
    id: ID!
    name: String
  }
`;

const types = {
  57487: {
    name: {
      en: "core",
    },
  },
};

const resolvers = {
  Query: {
    type(_, { id }) {
      return {
        id,
        name: types[id].name.en,
      };
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
