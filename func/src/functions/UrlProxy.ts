import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function UrlProxy(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    context.log("Fetching MP3 from URL...");

    // Fetch the MP3 from the specified URL
    const mp3Url = request.query.get('url');
    const response = await axios.get(mp3Url, {
      responseType: "arraybuffer", // Get the MP3 as an array buffer
    });

    context.log("MP3 fetched successfully.");

    // Set the HTTP response with the MP3 data and correct content type
    return {
      body: response.data,
      headers: {
        "Content-Type": "audio/mpeg", // Specify the correct content type for MP3
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: "Internal Server Error",
    };
  }
};

app.http("UrlProxy", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: UrlProxy,
});