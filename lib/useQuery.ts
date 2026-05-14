import useSWR from 'swr'

type QueryInput<TVariables> = {
  query: string
  variables?: TVariables
}

type GraphQLResponse<TData> = {
  data?: TData
  errors?: Array<{ message: string }>
}

const fetcher = async <TData, TVariables>({
  query,
  variables,
}: QueryInput<TVariables>): Promise<TData | undefined> => {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = (await res.json()) as GraphQLResponse<TData>
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }
  return json.data
}

export const useQuery = <TData, TVariables = Record<string, unknown>>(
  input: QueryInput<TVariables> | null
) => useSWR<TData | undefined>(input, fetcher<TData, TVariables>)
