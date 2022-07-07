import React from 'react'
import { useRouter } from 'next/router'
import { gql } from 'graphql-tag'
import { useQuery } from '../../src/useQuery'
import { Type } from '../../components/type'

const query = gql`
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

const TypeByID = () => {
  const router = useRouter()
  const { data, error } = useQuery({
    query,
    variables: { typeID: router.query.typeID },
  })

  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data) return '...'

  const {
    type: { typeID, typeName, builtBy, usedIn, manufacture },
  } = data

  return (
    <main>
      <h1>{typeName}</h1>
      <h2>ID: {typeID}</h2>
      {builtBy && (
        <Type typeID={builtBy.typeID} typeName={builtBy.typeName}>
          Built by
        </Type>
      )}
      {usedIn.map(({ typeID, typeName }) => (
        <Type typeID={typeID} typeName={typeName}>
          Used in
        </Type>
      ))}
      {manufacture?.products?.length > 1 && (
        <>
          <h3>Product</h3>
          {manufacture?.products.map(({ type: materialType, quantity }) => (
            <div>
              <Type
                typeID={materialType?.typeID}
                typeName={materialType?.typeName}
              >
                {quantity}
              </Type>
            </div>
          ))}
        </>
      )}
      {manufacture?.materials?.length > 1 && (
        <>
          <h3>Material</h3>
          {manufacture?.materials.map(({ type: materialType, quantity }) => (
            <div>
              <Type
                typeID={materialType?.typeID}
                typeName={materialType?.typeName}
              >
                {quantity}
              </Type>
            </div>
          ))}
        </>
      )}
    </main>
  )
}

export default TypeByID
