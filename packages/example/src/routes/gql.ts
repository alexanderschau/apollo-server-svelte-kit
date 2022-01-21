import type { RequestHandler } from '@sveltejs/kit';
import { gql, ApolloServer } from 'apollo-server-svelte-kit';

const handler: RequestHandler = async (req) => {
	const apolloServer = new ApolloServer({
		typeDefs: gql`
			type Query {
				ping: String!
			}
		`,
		resolvers: {
			Query: {
				ping: () => 'pong'
			}
		}
	});
	await apolloServer.start();
	const resp = await apolloServer.handleRequest(req);
	apolloServer.stop();
	return resp;
};

export const head = handler;
export const get = handler;
export const post = handler;
