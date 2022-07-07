import useSWR from 'swr'
import { print } from 'graphql/language/printer'

// this accepts a query AST, and renders it back into the
// original query, because I like how prettier/graphql-tag
// will do highlighting and formatting.

const fetcher = ({ query, ...options }) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query: print(query), ...options }),
  })
    .then((res) => res.json())
    .then((json) => json.data)

export const useQuery = (query) => useSWR(query, fetcher)
