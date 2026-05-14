import { describe, it, expect } from 'vitest'
import { execute, parse, validate } from 'graphql'
import { schema } from './schema'

const exec = async (
  query: string,
  context: unknown,
  variableValues?: Record<string, unknown>
) =>
  execute({
    schema,
    document: parse(query),
    contextValue: context,
    variableValues,
  })

describe('schema', () => {
  it('exposes the expected Query fields', () => {
    const fields = schema.getQueryType()?.getFields() ?? {}
    expect(Object.keys(fields).sort()).toEqual([
      'type',
      'typeWithName',
      'types',
    ])
  })

  it('validates an example query', () => {
    const doc = parse(/* GraphQL */ `
      query ($id: ID!) {
        type(typeID: $id) {
          typeID
          typeName
          manufacture {
            materials {
              type {
                typeName
              }
              quantity
            }
          }
        }
      }
    `)
    expect(validate(schema, doc)).toEqual([])
  })

  it('rejects queries that reference unknown fields', () => {
    const doc = parse(/* GraphQL */ `
      query {
        type(typeID: "1") {
          notARealField
        }
      }
    `)
    const errors = validate(schema, doc)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('returns a typeName for an existing type', async () => {
    const dataSource = {
      from: () => ({
        select: () => ({
          eq: () => ({
            limit: () => ({
              single: async () => ({
                data: { typeID: 34, typeName: 'Tritanium' },
              }),
            }),
          }),
        }),
      }),
    }
    const result = await exec(
      /* GraphQL */ `
        query ($id: ID!) {
          type(typeID: $id) {
            typeID
            typeName
          }
        }
      `,
      { dataSource },
      { id: '34' }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({
      type: { typeID: '34', typeName: 'Tritanium' },
    })
  })

  it('multiplies product quantities by runs', async () => {
    const queries: string[] = []
    const dataSource = {
      from: (table: string) => {
        queries.push(table)
        if (table === 'invTypes') {
          return {
            select: () => ({
              eq: () => ({
                limit: () => ({
                  single: async () => ({
                    data: { typeID: 11399, typeName: 'Morphite' },
                  }),
                }),
              }),
            }),
          }
        }
        return {
          select: () => ({
            eq: () => ({
              eq: async () => ({
                data: [{ productTypeID: 99, quantity: 5 }],
              }),
            }),
          }),
        }
      },
    }
    const result = await exec(
      /* GraphQL */ `
        query {
          type(typeID: "1") {
            manufacture(runs: 3) {
              products {
                quantity
              }
            }
          }
        }
      `,
      { dataSource }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({
      type: { manufacture: { products: [{ quantity: 15 }] } },
    })
  })
})
