import React from 'react'
import { gql } from 'graphql-tag'
import { useQuery } from '../../src/useQuery'
import { Type } from '../../components/type'

const query = gql`
  query GetAllTypes {
    types {
      typeID
      typeName
    }
  }
`

const Types = () => {
  const { data, error } = useQuery({ query })

  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data) return '...'

  return data.types.map(({ typeID, typeName }) => (
    <Type typeID={typeID} typeName={typeName} />
  ))
}

export default Types
