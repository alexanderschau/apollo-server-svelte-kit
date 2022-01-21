import type { GraphQLOptions, HttpQueryError } from "apollo-server-core";
import { runHttpQuery } from "apollo-server-core";
import type {RequestEvent} from "@sveltejs/kit/types/hooks"
import { Headers, Request as ApolloRequest } from "apollo-server-env";
import { ApolloServerBase } from "apollo-server-core";
import type {RequestHandler} from "@sveltejs/kit"

export class ApolloServer extends ApolloServerBase {
  async createGraphQLServerOptions(
    req: RequestEvent
  ): Promise<GraphQLOptions> {
    return await super.graphQLServerOptions({ req });
  }

  public handleRequest: RequestHandler = (req) => {

    new Headers({});
    const acceptedTypes = (new Headers(req.request.headers).get("Accept") || "")
      .toLowerCase()
      .split(",");
    const landingPage = this.getLandingPage();
    if (
      landingPage &&
      req.request.method === "GET" &&
      acceptedTypes.includes("text/html")
    ) {
      return {
        status: 200,
        headers: {
          "content-type": "text/html",
        },
        body: landingPage.html,
      };
    }

    return runHttpQuery([req], {
      method: req.request.method,
      options: () => this.createGraphQLServerOptions(req),
      query:
      req.request.method == "POST"
          ? (req.request.body as any)
          : req.url.searchParams.get("query")
          ? {
              query: req.url.searchParams.get("query"),
              variables: req.url.searchParams.get("variables"),
              operationName: req.url.searchParams.get("operationName"),
              extensions: req.url.searchParams.get("extensions"),
            }
          : null,
      request: {
        url: req.url.pathname,
        headers: new Headers(req.request.headers),
        method: req.request.method,
      } as ApolloRequest,
    }).then(
      ({ graphqlResponse, responseInit }) => {
        return {
          status: responseInit.status || 200,
          headers: responseInit.headers,
          body: graphqlResponse,
        };
      },
      (error: HttpQueryError) => {
        if ("HttpQueryError" !== error.name) throw error;
        return {
          status: error.statusCode,
          headers: {},
          body: error.message,
        };
      }
    );
  };
}
