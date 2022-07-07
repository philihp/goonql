import { createServer } from '@graphql-yoga/node'
import { gql } from 'graphql-tag'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const typeDefs = gql`
  type Query {
    type(typeID: ID!): Type
    types(first: Int = 99, after: ID = "0"): [Type]
  }

  type Type {
    typeID: ID
    typeName: String!
    manufacture: Activity
    builtBy: Type
    usedIn(first: Int = 10, after: ID = "0"): [Type]
  }

  type Activity {
    materials: [Quantity]
    products: [Quantity]
  }

  type Quantity {
    type: Type
    quantity: Int
  }
`

const resolvers = {
  Query: {
    type: async (_, { typeID }, { dataSource }) => {
      const { data } = await dataSource
        .from('invTypes')
        .select('typeID')
        .eq('typeID', typeID)
        .limit(1)
        .single()
      return data
    },
    types: async (_, { first, after }, { dataSource }) => {
      const { data: record } = await dataSource
        .from('invTypes')
        .select('typeID')
        .limit(first)
        .gt('typeID', after)
      return record
    },
  },
  Type: {
    builtBy: async ({ typeID }, _, { dataSource }) => {
      const { data } = await dataSource
        .from('industryActivityProducts')
        .select('typeID')
        .eq('activityID', 1)
        .eq('productTypeID', typeID)
        .limit(1)
        .single()
      return data
    },
    usedIn: async ({ typeID }, { first, after }, { dataSource }) => {
      const { data } = await dataSource
        .from('industryActivityMaterials')
        .select('typeID')
        .eq('activityID', 1)
        .eq('materialTypeID', typeID)
        .gt('typeID', after)
        .limit(first)
      return data.map(({ typeID }) => ({ typeID }))
    },
    typeName: async ({ typeID }, _, { dataSource }) => {
      const {
        data: { typeName },
      } = await dataSource
        .from('invTypes')
        .select('typeName')
        .eq('typeID', typeID)
        .limit(1)
        .single()
      return typeName
    },
    manufacture: (parent) => {
      return parent
    },
  },
  Activity: {
    materials: async ({ typeID }, _, { dataSource }) => {
      const { data } = await dataSource
        .from('industryActivityMaterials')
        .select('materialTypeID, quantity')
        .eq('activityID', 1)
        .eq('typeID', typeID)
      return data.map(({ materialTypeID, quantity }) => ({
        type: {
          typeID: materialTypeID,
        },
        quantity,
      }))
    },
    products: async ({ typeID }, _, { dataSource }) => {
      const { data } = await dataSource
        .from('industryActivityProducts')
        .select('productTypeID, quantity')
        .eq('activityID', 1)
        .eq('typeID', typeID)
      return data.map(({ productTypeID, quantity }) => ({
        type: {
          typeID: productTypeID,
        },
        quantity,
      }))
    },
  },
}

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  endpoint: '/api/graphql',
  context: () => ({
    dataSource: createClient(supabaseUrl, supabaseKey),
  }),
})

export default server
