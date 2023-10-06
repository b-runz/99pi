import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

export async function ServeMP3FromURL(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    context.log("Fetching MP3 from URL...");

    // Fetch the MP3 from the specified URL
    const mp3Url = "https://dts.podtrac.com/redirect.mp3/chrt.fm/track/288D49/stitcher.simplecastaudio.com/3bb687b0-04af-4257-90f1-39eef4e631b6/episodes/acca70c7-f331-4767-b888-bf22d91b0602/audio/128/default.mp3?aid=rss_feed&awCollectionId=3bb687b0-04af-4257-90f1-39eef4e631b6&awEpisodeId=acca70c7-f331-4767-b888-bf22d91b0602&feed=BqbsxVfO";
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

app.http("ServeMP3FromURL", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: ServeMP3FromURL,
});