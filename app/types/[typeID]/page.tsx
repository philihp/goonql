'use client'

import { use } from 'react'
import { useQuery } from '../../../lib/useQuery'
import { Type } from '../../../components/Type'

const query = /* GraphQL */ `
  query GetType($typeID: ID!) {
    type(typeID: $typeID) {
      typeID
      typeName
      builtBy {
        typeID
        typeName
      }
      usedIn(first: 42) {
        typeID
        typeName
      }
      manufacture {
        materials {
          type {
            typeID
            typeName
          }
          quantity
        }
        products {
          type {
            typeID
            typeName
          }
          quantity
        }
      }
    }
  }
`

type GqlType = {
  typeID: string
  typeName: string
}

type Quantity = {
  type: GqlType
  quantity: number
}

type Activity = {
  materials: Quantity[] | null
  products: Quantity[] | null
}

type TypeData = {
  type: {
    typeID: string
    typeName: string
    builtBy: GqlType | null
    usedIn: GqlType[]
    manufacture: Activity | null
  }
}

const TypeByID = ({ params }: { params: Promise<{ typeID: string }> }) => {
  const { typeID } = use(params)
  const { data, error } = useQuery<TypeData, { typeID: string }>({
    query,
    variables: { typeID },
  })

  if (error) return <pre>{String(error)}</pre>
  if (!data) return <>...</>

  const {
    type: { typeID: id, typeName, builtBy, usedIn, manufacture },
  } = data

  return (
    <main>
      <h1>{typeName}</h1>
      <h2>ID: {id}</h2>
      {builtBy && (
        <Type typeID={builtBy.typeID} typeName={builtBy.typeName}>
          Built by
        </Type>
      )}
      {usedIn.map((t) => (
        <Type key={t.typeID} typeID={t.typeID} typeName={t.typeName}>
          Used in
        </Type>
      ))}
      {(manufacture?.products?.length ?? 0) > 0 && (
        <>
          <h3>Product</h3>
          {manufacture?.products?.map(({ type, quantity }) => (
            <Type key={type.typeID} typeID={type.typeID} typeName={type.typeName}>
              {quantity}
            </Type>
          ))}
        </>
      )}
      {(manufacture?.materials?.length ?? 0) > 0 && (
        <>
          <h3>Material</h3>
          {manufacture?.materials?.map(({ type, quantity }) => (
            <Type key={type.typeID} typeID={type.typeID} typeName={type.typeName}>
              {quantity}
            </Type>
          ))}
        </>
      )}
    </main>
  )
}

export default TypeByID
