import { cost, type ModifierParams } from 'eve-industry'
import type { Context } from './context'

const ACTIVITY_MANUFACTURE = 1
const ACTIVITY_REACT = 11
const INDUSTRY_ACTIVITIES = [ACTIVITY_MANUFACTURE, ACTIVITY_REACT]

type TypeSource = {
  typeID: string | number
  typeName?: string | null
}

type IndustryArgs = Omit<ModifierParams, 'base'>

type ActivitySource = IndustryArgs & {
  typeID: string | number
  activityID: number
}

export const resolvers = {
  Query: {
    type: async (
      _: unknown,
      { typeID }: { typeID: string },
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('invTypes')
        .select('typeID, typeName')
        .eq('typeID', typeID)
        .limit(1)
        .single()
      return data
    },
    typeWithName: async (
      _: unknown,
      { typeName }: { typeName: string },
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('invTypes')
        .select('typeID, typeName')
        .eq('typeName', typeName)
        .limit(1)
        .single()
      return data
    },
    types: async (
      _: unknown,
      { first, after }: { first: number; after: string },
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('invTypes')
        .select('typeID, typeName')
        .gt('typeID', after)
        .limit(first)
      return data ?? []
    },
  },
  Type: {
    typeName: async (
      { typeID, typeName }: TypeSource,
      _: unknown,
      { dataSource }: Context
    ) => {
      if (typeName) return typeName
      const { data } = await dataSource
        .from('invTypes')
        .select('typeName')
        .eq('typeID', typeID)
        .limit(1)
        .single()
      return data?.typeName ?? null
    },
    builtBy: async (
      { typeID }: TypeSource,
      _: unknown,
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('industryActivityProducts')
        .select('typeID')
        .in('activityID', INDUSTRY_ACTIVITIES)
        .eq('productTypeID', typeID)
        .limit(1)
        .single()
      return data
    },
    usedIn: async (
      { typeID }: TypeSource,
      { first, after }: { first: number; after: string },
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('industryActivityMaterials')
        .select('typeID')
        .in('activityID', INDUSTRY_ACTIVITIES)
        .eq('materialTypeID', typeID)
        .gt('typeID', after)
        .limit(first)
      return (data ?? []).map(({ typeID: t }) => ({ typeID: t }))
    },
    react: ({ typeID }: TypeSource, args: IndustryArgs): ActivitySource => ({
      typeID,
      activityID: ACTIVITY_REACT,
      ...args,
    }),
    manufacture: (
      { typeID }: TypeSource,
      args: IndustryArgs
    ): ActivitySource => ({
      typeID,
      activityID: ACTIVITY_MANUFACTURE,
      ...args,
    }),
  },
  Activity: {
    materials: async (
      { typeID, activityID, ...buildArgs }: ActivitySource,
      _: unknown,
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('industryActivityMaterials')
        .select('materialTypeID, quantity')
        .eq('activityID', activityID)
        .eq('typeID', typeID)
      return (data ?? []).map(({ materialTypeID, quantity }) => ({
        type: { typeID: materialTypeID },
        quantity: cost({ ...buildArgs, base: [quantity] })[0],
      }))
    },
    products: async (
      { typeID, activityID, runs = 1 }: ActivitySource,
      _: unknown,
      { dataSource }: Context
    ) => {
      const { data } = await dataSource
        .from('industryActivityProducts')
        .select('productTypeID, quantity')
        .eq('activityID', activityID)
        .eq('typeID', typeID)
      return (data ?? []).map(({ productTypeID, quantity }) => ({
        type: { typeID: productTypeID },
        quantity: runs * quantity,
      }))
    },
  },
}
