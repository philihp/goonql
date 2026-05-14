export const typeDefs = /* GraphQL */ `
  type Query {
    type(typeID: ID!): Type
    typeWithName(typeName: String!): Type
    types(first: Int = 1000, after: ID = "0"): [Type!]!
  }

  type Type {
    typeID: ID
    typeName: String!
    manufacture(
      runs: Int = 1
      blueprint: Float = 0.0
      rig: Float = 0.02
      sec: Float = 2.1
      structure: Float = 0.01
    ): Activity
    react(runs: Int = 1, rig: Float = 0.02): Activity
    builtBy: Type
    usedIn(first: Int = 5, after: ID = "0"): [Type!]!
  }

  type Activity {
    materials: [Quantity!]!
    products: [Quantity!]!
  }

  type Quantity {
    type: Type
    quantity: Int
  }
`
