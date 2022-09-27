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

Then create an SvelteKit Endpoint (e.g. `src/routes/graphql/+server.js`) and add the following content:

```js
import { getDefaultHandler, gql } from '$lib';

const handler = getDefaultHandler(
	gql`
		type Query {
			ping: String!
		}
	`,
	{
		Query: {
			ping: () => 'pong'
		}
	}
);

export const GET = handler;
export const HEAD = handler;
export const POST = handler;
```

For more details take a look at the [Apollo Documentation](https://www.apollographql.com/docs/apollo-server/getting-started/).
