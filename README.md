# GoonQL

A GraphQL interface to a curated subset of the EVE SDE.

Built with Next.js 15 (App Router), React 19, TypeScript, and [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) v5 over [Supabase](https://supabase.com).

## Quick example

```graphql
query ($typeID: ID!) {
  type(typeID: $typeID) {
    typeID
    typeName
    builtBy {
      typeName
      manufacture {
        materials {
          type {
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
    usedIn(first: 40, after: "1") {
      typeID
      typeName
      manufacture {
        materials {
          type {
            typeName
          }
          quantity
        }
        products {
          type {
            typeName
          }
          quantity
        }
      }
    }
  }
}
```

[Try it out](https://goonql.philihp.com/api/graphql?query=query+%28%24typeID%3A+ID%21%29+%7B%0A++type%28typeID%3A+%24typeID%29+%7B%0A++++typeID%0A++++typeName%0A++++builtBy+%7B%0A++++++typeName%0A++++++manufacture+%7B%0A++++++++materials+%7B%0A++++++++++type+%7B%0A++++++++++++typeName%0A++++++++++%7D%0A++++++++++quantity%0A++++++++%7D%0A++++++++products+%7B%0A++++++++++type+%7B%0A++++++++++++typeID%0A++++++++++++typeName%0A++++++++++%7D%0A++++++++++quantity%0A++++++++%7D%0A++++++%7D%0A++++%7D%0A++++usedIn%28first%3A+40%2C+after%3A+%221%22%29+%7B%0A++++++typeID%0A++++++typeName%0A++++++manufacture+%7B%0A++++++++materials+%7B%0A++++++++++type+%7B%0A++++++++++++typeName%0A++++++++++%7D%0A++++++++++quantity%0A++++++++%7D%0A++++++++products+%7B%0A++++++++++type+%7B%0A++++++++++++typeName%0A++++++++++%7D%0A++++++++++quantity%0A++++++++%7D%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D)

## Development

Requires Node 20+ and [pnpm](https://pnpm.io) 10+.

```sh
pnpm install
pnpm dev          # start the dev server
pnpm lint         # lint
pnpm typecheck    # type-check
pnpm test         # run tests
pnpm build        # production build
```

The GraphQL endpoint is mounted at `/api/graphql`. Supabase credentials are read from `SUPABASE_URL` and `SUPABASE_KEY`.
