/**
 * System-related MCP tools (Health, Resources, Deployments, etc.)
 */

import { CoolifyAPIClient } from '../api-client.js';
import { safeApiCall } from './utils.js';

export function registerSystemTools(server: any, apiClient: CoolifyAPIClient) {
  
  // Health check
  server.registerTool(
    'health-check',
    {
      title: 'Health Check',
      description: 'Check the health status of the Coolify instance'
    },
    async () => safeApiCall(() => apiClient.healthCheck(), 'health check')
  );

  // List all resources
  server.registerTool(
    'list-resources',
    {
      title: 'List Resources',
      description: 'List all resources (applications, databases, services)'
    },
    async () => safeApiCall(() => apiClient.listResources(), 'list resources')
  );

  // List deployments
  server.registerTool(
    'list-deployments',
    {
      title: 'List Deployments',
      description: 'List all deployments'
    },
    async () => safeApiCall(() => apiClient.listDeployments(), 'list deployments')
  );
}
