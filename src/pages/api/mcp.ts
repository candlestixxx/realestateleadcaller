import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Initialize the MCP Server globally
const server = new Server(
  {
    name: "jules-mls-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_mls_inventory",
        description: "Query the local MLS (Multiple Listing Service) database for available properties based on neighborhood or zipcode.",
        inputSchema: {
          type: "object",
          properties: {
            neighborhood: { type: "string", description: "The neighborhood name (e.g., 'Downtown')" },
            zipcode: { type: "string", description: "The 5-digit zipcode" },
          }
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "query_mls_inventory") {
    // Mock MLS response logic for Phase 3 Foundation
    const neighborhood = request.params.arguments?.neighborhood || "Unknown Area";
    return {
      content: [
        {
          type: "text",
          text: `Found 3 active listings in ${neighborhood}. 1: 123 Main St ($450k). 2: 456 Elm St ($520k). 3: 789 Oak Ave ($390k).`
        }
      ]
    };
  }
  throw new Error("Tool not found");
});

// Store global transport instances (in memory - ephemeral for dev)
let globalTransport: SSEServerTransport | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Initialize SSE Transport
    globalTransport = new SSEServerTransport("/api/mcp", res as any);
    await server.connect(globalTransport);

    // SSEServerTransport will take over the response and keep it open
    return;
  } else if (req.method === 'POST') {
    if (!globalTransport) {
      res.status(400).json({ error: "SSE connection not established" });
      return;
    }

    try {
      // Pages API already parses the body
      await globalTransport.handlePostMessage(req as any, res as any, req.body);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to process message" });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
