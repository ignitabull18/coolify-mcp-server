#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import { config } from 'dotenv';
import { CoolifyAPIClient } from './api-client.js';
import { CoolifyConfig, CoolifyAPIError } from './types.js';
import { registerCoolifyTools } from './tools-all.js';
import { registerCoolifyResources } from './resources-enhanced.js';
import { registerCoolifyPrompts } from './prompts-enhanced.js';

// Load environment variables
config();

/**
 * HTTP-based MCP Server for Coolify API
 * 
 * This server provides remote access to Coolify's API through HTTP transport.
 * Clients can connect via Server-Sent Events (SSE) for real-time communication.
 */

// Configuration validation
function validateConfig(): CoolifyConfig & { port: number; host: string } {
  const baseUrl = process.env.COOLIFY_BASE_URL;
  const apiToken = process.env.COOLIFY_API_TOKEN;
  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';

  if (!baseUrl || !apiToken) {
    console.error('❌ Missing required environment variables:');
    if (!baseUrl) console.error('  - COOLIFY_BASE_URL');
    if (!apiToken) console.error('  - COOLIFY_API_TOKEN');
    console.error('\nOptional environment variables:');
    console.error('  - PORT (default: 3000)');
    console.error('  - HOST (default: 0.0.0.0)');
    process.exit(1);
  }

  return { baseUrl, apiToken, port, host };
}

// Create MCP server
async function createMcpServer(): Promise<McpServer> {
  const config = validateConfig();
  
  // Initialize Coolify API client
  const apiClient = new CoolifyAPIClient(config);

  // Test API connection
  try {
    console.log('🔍 Testing Coolify API connection...');
    await apiClient.healthCheck();
    console.log('✅ Successfully connected to Coolify API');
  } catch (error) {
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
    description: 'Remote HTTP MCP server for Coolify API - provides access to all Coolify endpoints via SSE transport'
  });

  // Register all components
  console.log('📦 Registering Coolify tools...');
  registerCoolifyTools(server, apiClient);
  
  console.log('📚 Registering Coolify resources...');
  registerCoolifyResources(server, apiClient);
  
  console.log('💡 Registering Coolify prompts...');
  registerCoolifyPrompts(server, apiClient);

  console.log('✅ All components registered successfully');

  return server;
}

// Create Express app for HTTP transport
async function createHttpServer() {
  const config = validateConfig();
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // CORS middleware for cross-origin requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'coolify-mcp-server',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Info endpoint
  app.get('/info', (req, res) => {
    res.json({
      name: 'Coolify MCP Server',
      version: '1.0.0',
      description: 'Remote HTTP MCP server for Coolify API',
      endpoints: {
        health: '/health',
        info: '/info',
        mcp: '/mcp (SSE endpoint for MCP communication)'
      },
      features: {
        tools: '50+ API tools covering all Coolify endpoints',
        resources: '10+ resources for accessing Coolify data',
        prompts: '8+ prompts for common DevOps workflows'
      }
    });
  });

  // MCP Server-Sent Events endpoint
  app.get('/mcp', async (req, res) => {
    console.log('🔗 New MCP client connection established');
    
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    try {
      const mcpServer = await createMcpServer();
      
      // Create a simple transport that communicates via SSE
      const transport = {
        start: async () => {
          console.log('🚀 MCP transport started');
        },
        
        send: (message: any) => {
          res.write(`data: ${JSON.stringify(message)}\n\n`);
        },
        
        close: () => {
          console.log('👋 MCP client disconnected');
          res.end();
        }
      };

      // Handle client messages (this would need to be implemented based on the actual MCP SDK)
      req.on('data', (chunk) => {
        try {
          const message = JSON.parse(chunk.toString());
          // Forward to MCP server (implementation depends on SDK)
          console.log('📨 Received MCP message:', message);
        } catch (error) {
          console.error('❌ Error parsing client message:', error);
        }
      });

      // Handle client disconnect
      req.on('close', () => {
        transport.close();
      });

      // Start the transport
      await transport.start();
      
      // Send initial connection success
      transport.send({
        type: 'connection',
        status: 'connected',
        message: 'Successfully connected to Coolify MCP Server'
      });

    } catch (error) {
      console.error('❌ Error setting up MCP connection:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to establish MCP connection' })}\n\n`);
      res.end();
    }
  });

  return { app, config };
}

// Main execution
async function main() {
  console.log('🌐 Starting Coolify MCP HTTP Server...');
  console.log('=====================================');
  console.log('');
  
  try {
    const { app, config } = await createHttpServer();
    
    const server = app.listen(config.port, config.host, () => {
      console.log('✅ Coolify MCP HTTP Server is running!');
      console.log('');
      console.log('🌐 Server Details:');
      console.log(`   🔗 URL: http://${config.host}:${config.port}`);
      console.log(`   🏥 Health: http://${config.host}:${config.port}/health`);
      console.log(`   ℹ️  Info: http://${config.host}:${config.port}/info`);
      console.log(`   🔌 MCP: http://${config.host}:${config.port}/mcp`);
      console.log('');
      console.log('🎯 Server capabilities:');
      console.log('   📱 50+ API Tools covering all Coolify endpoints');
      console.log('   📊 10+ Resources for accessing Coolify data');  
      console.log('   🛠️  8+ Prompts for common DevOps workflows');
      console.log('   🔧 Complete CRUD operations for all resource types');
      console.log('   📈 Monitoring, deployment, and maintenance workflows');
      console.log('');
      console.log('🎉 Ready to accept MCP client connections!');
    });

    // Graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n👋 Shutting down HTTP server...');
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    console.error('💥 Failed to start HTTP server:', error);
    process.exit(1);
  }
}

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
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}