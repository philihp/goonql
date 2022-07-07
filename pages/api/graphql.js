import { createServer } from "@graphql-yoga/node";
import { gql } from "graphql-tag";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const typeDefs = gql`
  type Query {
    type(typeID: ID!): Type
  }

  type Type {
    typeID: ID
    typeName: String!
    manufacture: Activity
    built_by_blueprint: [Type]
    used_in_blueprint: [Type]
  }

  type Activity {
    materials: [Quantity]
    products: [Quantity]
  }

  type Quantity {
    type: Type
    quantity: Int
  }
`;

const resolvers = {
  Query: {
    type: async (_, { typeID }, { dataSource }) => {
      console.log("query.type");
      const {
        data: [record],
      } = await dataSource
        .from("invTypes")
        .select("typeID")
        .eq("typeID", typeID);
      return record;
    },
  },
  Type: {
    built_by_blueprint: async ({ typeID }, _args, { dataSource }) => {
      console.log("type.created_by_blueprint", typeID);
      const { data } = await dataSource
        .from("industryActivityProducts")
        .select("typeID, quantity")
        .eq("activityID", 1)
        .eq("productTypeID", typeID);
      return data.map(({ typeID }) => ({ typeID }));
    },
    used_in_blueprint: async ({ typeID }, _args, { dataSource }) => {
      console.log("type.used_in_blueprint", typeID);
      const { data } = await dataSource
        .from("industryActivityMaterials")
        .select("typeID, quantity")
        .eq("activityID", 1)
        .eq("materialTypeID", typeID);
      return data.map(({ typeID }) => ({ typeID }));
    },
    typeName: async ({ typeID }, _args, { dataSource }) => {
      console.log("type.typeName", typeID);
      const {
        data: [{ typeName }],
      } = await dataSource
        .from("invTypes")
        .select("typeName")
        .eq("typeID", typeID);
      return typeName;
    },
    manufacture: (parent) => {
      console.log("type.manufacture", parent);
      return parent;
    },
  },
  Activity: {
    materials: async ({ typeID }, _args, { dataSource }) => {
      console.log("activity.materials", typeID);
      const { data } = await dataSource
        .from("industryActivityMaterials")
        .select("materialTypeID, quantity")
        .eq("activityID", 1)
        .eq("typeID", typeID);
      return data.map(({ materialTypeID, quantity }) => ({
        type: {
          typeID: materialTypeID,
        },
        quantity,
      }));
    },
    products: async ({ typeID }, args, { dataSource }) => {
      console.log("activity.products", typeID);
      const { data } = await dataSource
        .from("industryActivityProducts")
        .select("productTypeID, quantity")
        .eq("activityID", 1)
        .eq("typeID", typeID);
      return data.map(({ productTypeID, quantity }) => ({
        type: {
          typeID: productTypeID,
        },
        quantity,
      }));
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: "/api/graphql",
  context: () => ({
    dataSource: createClient(supabaseUrl, supabaseKey),
  }),
});

export default server;
