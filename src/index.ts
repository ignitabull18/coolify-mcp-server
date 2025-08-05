#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from 'dotenv';
import { CoolifyAPIClient } from './api-client.js';
import { CoolifyConfig, CoolifyAPIError } from './types.js';
import { registerCoolifyTools } from './tools-all.js';
import { registerCoolifyResources } from './resources-simple.js';
import { registerCoolifyPrompts } from './prompts-simple.js';

// Load environment variables
config();

/**
 * Comprehensive MCP Server for Coolify API
 * 
 * This server provides complete access to Coolify's API through the Model Context Protocol.
 * It includes tools for managing applications, databases, services, servers, and more,
 * along with resources for accessing data and prompts for common workflows.
 */

// Configuration validation
function validateConfig(): CoolifyConfig {
  const baseUrl = process.env.COOLIFY_BASE_URL;
  const apiToken = process.env.COOLIFY_API_TOKEN;

  if (!baseUrl || !apiToken) {
    console.error('❌ Missing required environment variables:');
    if (!baseUrl) console.error('  - COOLIFY_BASE_URL');
    if (!apiToken) console.error('  - COOLIFY_API_TOKEN');
    console.error('\nPlease check your .env file or environment variables.');
    process.exit(1);
  }

  return { baseUrl, apiToken };
}

// Server setup
async function createServer(): Promise<McpServer> {
  const config = validateConfig();
  
  // Initialize Coolify API client
  const apiClient = new CoolifyAPIClient(config);

  // Test API connection silently
  try {
    await apiClient.healthCheck();
  } catch (error) {
    // Write errors to stderr so they don't interfere with MCP protocol
    console.error('❌ Failed to connect to Coolify API:');
    if (error instanceof CoolifyAPIError) {
      console.error(`   Status: ${error.statusCode}`);
      console.error(`   Message: ${error.message}`);
    } else {
      console.error(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    console.error('\nPlease check your COOLIFY_BASE_URL and COOLIFY_API_TOKEN');
    process.exit(1);
  }

  // Create MCP server
  const server = new McpServer({
    name: 'coolify-mcp-server',
    version: '1.0.0',
    description: 'Comprehensive MCP server for Coolify API - provides access to all Coolify endpoints, resources, and operations'
  });

  // Register all components
  registerCoolifyTools(server, apiClient);
  registerCoolifyResources(server, apiClient);
  registerCoolifyPrompts(server, apiClient);

  return server;
}

// Main execution
async function main() {
  try {
    const server = await createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Server is now running and connected via stdio
    // All communication happens through the MCP protocol
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});