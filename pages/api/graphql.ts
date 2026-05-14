import { createYoga } from 'graphql-yoga'
import { schema } from '../../lib/graphql/schema'
import { createContext } from '../../lib/graphql/context'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: '/api/graphql',
})
