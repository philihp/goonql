import { createYoga } from 'graphql-yoga'
import { schema } from '../../../lib/graphql/schema'
import { createContext } from '../../../lib/graphql/context'

const yoga = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
})

const handler = (request: Request) => yoga.handle(request)

export { handler as GET, handler as POST, handler as OPTIONS }
