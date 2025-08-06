/**
 * Main aggregator for all Coolify MCP tools
 * 
 * This file imports and registers all tool categories,
 * maintaining separation of concerns while providing
 * a single entry point for tool registration.
 */

import { CoolifyAPIClient } from '../api-client.js';
import { registerApplicationTools } from './applications.js';
import { registerDatabaseTools } from './databases.js';
import { registerServiceTools } from './services.js';
import { registerEnvironmentTools } from './environments.js';
import { registerInfrastructureTools } from './infrastructure.js';
import { registerSystemTools } from './system.js';

/**
 * Register all Coolify tools with the MCP server
 * 
 * @param server - The MCP server instance
 * @param apiClient - The Coolify API client instance
 */
export function registerAllCoolifyTools(server: any, apiClient: CoolifyAPIClient) {
  console.log('🔧 Registering Coolify MCP tools...');
  
  // Register tools by category
  registerApplicationTools(server, apiClient);     // 12 tools
  registerDatabaseTools(server, apiClient);        // 8 tools
  registerServiceTools(server, apiClient);         // 8 tools
  registerEnvironmentTools(server, apiClient);     // 8 tools
  registerInfrastructureTools(server, apiClient);  // 23 tools
  registerSystemTools(server, apiClient);          // 3 tools
  
  console.log('✅ Successfully registered 62 Coolify MCP tools');
}

/**
 * Tool categories and counts:
 * 
 * Applications (12):
 *   - list, get, create, update, delete
 *   - start, stop, restart
 *   - logs, deploy, list-deployments
 * 
 * Databases (8):
 *   - list, get, create, update, delete
 *   - start, stop, restart
 * 
 * Services (8):
 *   - list, get, create, update, delete
 *   - start, stop, restart
 * 
 * Environment Variables (8):
 *   - Application: list, create, update, delete
 *   - Service: list, create, update, delete
 * 
 * Infrastructure (23):
 *   - Projects: list, get, create, update, delete, get-environment
 *   - Servers: list, get, create, update, delete, resources, domains, validate
 *   - Teams: list, get, get-members, get-authenticated, get-authenticated-members
 * 
 * System (3):
 *   - health-check
 *   - list-resources
 *   - list-deployments
 */
