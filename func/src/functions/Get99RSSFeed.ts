import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function Get99RSSFeed(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return { body: `Hello` };
};

app.http('Get99RSSFeed', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Get99RSSFeed
});
