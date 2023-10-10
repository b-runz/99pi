import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";
import { parseString, Builder } from "xml2js";

const parseXmlAsync = (xmlData: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export async function Get99RSSFeedV2(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const rssUrl = "https://feeds.simplecast.com/BqbsxVfO";

    context.log("Fetching RSS podcast feed from:", rssUrl);

    // Fetch the RSS feed
    const response = await axios.get(rssUrl);

    if (response.status !== 200) {
      throw new Error("Failed to fetch RSS feed.");
    }

    context.log("RSS podcast feed fetched successfully.");

    // Parse the XML response
    const xmlData = response.data;
    const result = await parseXmlAsync(xmlData);

    // Replace the URL within the enclosure tag with a URL-encoded version
    if (result.rss && result.rss.channel) {
      result.rss.channel[0].title = "99pi"
      if (result.rss.channel[0].item) {
        const items = result.rss.channel[0].item;
        for (const item of items) {
          if (item.enclosure && item.enclosure[0].$.url) {
            const originalUrl = item.enclosure[0].$.url;
            const encodedUrl =
              "https://jolly-water-052fedd03.3.azurestaticapps.net/api/UrlProxy?url=" +
              encodeURIComponent(originalUrl);
            item.enclosure[0].$.url = encodedUrl;
          }
        }
      }
    }

    // Build the modified XML data
    const builder = new Builder();
    const modifiedXml = builder.buildObject(result);

    return {
      body: modifiedXml,
      headers: {
        "Content-Type": "application/xml",
      },
    };


  } catch (error) {
    return {
      status: 500,
      body: "Internal Server Error",
    };
  }
};

app.http("Get99RSSFeedV2", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: Get99RSSFeedV2,
});