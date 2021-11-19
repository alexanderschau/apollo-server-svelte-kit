import type { GraphQLOptions, HttpQueryError } from "apollo-server-core";
import { runHttpQuery } from "apollo-server-core";
import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import { Headers, Request as ApolloRequest } from "apollo-server-env";
import { ApolloServerBase } from "apollo-server-core";

export class ApolloServer extends ApolloServerBase {
  async createGraphQLServerOptions(
    req: ServerRequest
  ): Promise<GraphQLOptions> {
    return await super.graphQLServerOptions({ req });
  }

  public handleRequest = (
    req: ServerRequest
  ): Promise<EndpointOutput> | EndpointOutput => {
    new Headers({});
    const acceptedTypes = (new Headers(req.headers).get("Accept") || "")
      .toLowerCase()
      .split(",");
    const landingPage = this.getLandingPage();
    if (
      landingPage &&
      req.method === "GET" &&
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
      method: req.method,
      options: () => this.createGraphQLServerOptions(req),
      query:
        req.method == "POST"
          ? (req.body as any)
          : req.query.get("query")
          ? {
              query: req.query.get("query"),
              variables: req.query.get("variables"),
              operationName: req.query.get("operationName"),
              extensions: req.query.get("extensions"),
            }
          : null,
      request: {
        url: req.path,
        headers: new Headers(req.headers),
        method: req.method,
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
