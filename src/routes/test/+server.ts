import type { RequestHandler } from './$types';
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

export const GET: RequestHandler = handler;
export const HEAD: RequestHandler = handler;
export const POST: RequestHandler = handler;
