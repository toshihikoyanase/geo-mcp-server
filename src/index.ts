#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

// Create the MCP server instance
const server = new McpServer({
  name: "Elevation Fetcher",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

// Register the `getElevation` tool
server.tool(
  "getElevation",
  "Fetches elevation data for a given latitude and longitude",
  {
    input: z.object({
      lat: z.number().describe("Latitude of the location"),
      lon: z.number().describe("Longitude of the location"),
    }),
  },
  async ({ input }) => {
    const { lat, lon } = input;
    const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch elevation data: ${response.statusText}`);
      }

      const data = (await response.json()) as { elevation?: number | string };
      if (data.elevation === undefined) {
        throw new Error("Elevation data is not available for the given coordinates.");
      }
      if (typeof data.elevation !== "number") {
        throw new Error("Elevation data type is invalid: expected a number.");
      }

      return {
        content: [
          {
            type: "text",
            text: `The elevation at latitude ${lat} and longitude ${lon} is ${data.elevation} meters.`,
          },
        ],
      };
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
      return {
        content: [
          {
            type: "text",
            text: `Error fetching elevation data: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server to fetch elevation from latitude and longitude using the Geospatial Information Authority of Japan API");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});