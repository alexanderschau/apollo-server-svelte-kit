import type { RequestHandler } from './$types';
import { ApolloServer, gql } from '$lib';

export const POST: RequestHandler = async (req) => {
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
