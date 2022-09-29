import type { RequestHandler } from '@sveltejs/kit';
import { ApolloServer } from './apolloServer.js';
import type { DocumentNode } from 'graphql';

export const getDefaultHandler = (typeDefs: DocumentNode, resolvers: any) => {
	const fn: RequestHandler = async (req) => {
		const apolloServer = new ApolloServer({
			typeDefs: typeDefs,
			resolvers: resolvers
		});
		await apolloServer.start();
		const resp = await apolloServer.handleRequest(req);
		apolloServer.stop();
		return resp;
	};

	return fn;
};
