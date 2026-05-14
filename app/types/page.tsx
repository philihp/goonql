'use client'

import { useQuery } from '../../lib/useQuery'
import { Type } from '../../components/Type'

const query = /* GraphQL */ `
  query GetAllTypes {
    types {
      typeID
      typeName
    }
  }
`

type TypesData = {
  types: Array<{ typeID: string; typeName: string }>
}

const Types = () => {
  const { data, error } = useQuery<TypesData>({ query })

  if (error) return <pre>{String(error)}</pre>
  if (!data) return <>...</>

  return (
    <>
      {data.types.map(({ typeID, typeName }) => (
        <Type key={typeID} typeID={typeID} typeName={typeName} />
      ))}
    </>
  )
}

export default Types
