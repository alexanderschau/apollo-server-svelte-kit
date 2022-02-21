# Apollo Server for Svelte Kit

An Apollo GraphQL Server integration for SvelteKit 🥳.

> **Note**: Major and minor releases are equivalent to [apollo-server-core](https://www.npmjs.com/package/apollo-server-core).

## Usage

In a new project, install the `apollo-server-svelte-kit` and `graphql` dependencies using:

```
npm install apollo-server-svelte-kit graphql
```

or

```
yarn add apollo-server-svelte-kit graphql
```

Then create an SvelteKit Endpoint (e.g. `src/routes/graphql.js`) and add the following content:

```js
import { gql, ApolloServer } from "apollo-server-svelte-kit";

const handler = async (req) => {
  const apolloServer = new ApolloServer({
    typeDefs: gql`
      type Query {
        ping: String!
      }
    `,
    resolvers: {
      Query: {
        ping: () => "pong",
      },
    },
  });
  await apolloServer.start();
  const resp = await apolloServer.handleRequest(req);
  apolloServer.stop();
  return resp;
};

export const head = handler;
export const get = handler;
export const post = handler;
```

For more details take a look at the [Apollo Documentation](https://www.apollographql.com/docs/apollo-server/getting-started/).
