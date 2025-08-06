/**
 * Service-related MCP tools for Coolify
 */

import { z } from 'zod';
import { CoolifyAPIClient } from '../api-client.js';
import { createToolResponse, safeApiCall } from './utils.js';

export function registerServiceTools(server: any, apiClient: CoolifyAPIClient) {
  
  // List all services
  server.registerTool(
    'list-services',
    {
      title: 'List Services',
      description: 'Retrieve all services in your Coolify instance'
    },
    async () => safeApiCall(() => apiClient.listServices(), 'list services')
  );

  // Get specific service
  server.registerTool(
    'get-service',
    {
      title: 'Get Service',
      description: 'Get details of a specific service. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the service')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getService(args.uuid),
        'get service details'
      );
    }
  );

  // Create service
  server.registerTool(
    'create-service',
    {
      title: 'Create Service',
      description: 'Create a new service. Requires service configuration data',
      inputSchema: {
        data: z.object({
          server_uuid: z.string().describe('UUID of the server'),
          project_uuid: z.string().describe('UUID of the project'),
          name: z.string().describe('Service name'),
          docker_compose_raw: z.string().optional().describe('Docker Compose configuration'),
          description: z.string().optional().describe('Service description')
        })
      }
    },
    async (args: any) => {
      if (!args.data) {
        return createToolResponse('Error: data parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.createService(args.data),
        'create service'
      );
    }
  );

  // Update service
  server.registerTool(
    'update-service',
    {
      title: 'Update Service',
      description: 'Update service configuration. Requires: uuid, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the service'),
        data: z.object({
          name: z.string().optional().describe('Service name'),
          description: z.string().optional().describe('Service description')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.updateService(args.uuid, args.data),
        'update service'
      );
    }
  );

  // Delete service
  server.registerTool(
    'delete-service',
    {
      title: 'Delete Service',
      description: 'Delete a service. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the service to delete')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.deleteService(args.uuid),
        'delete service'
      );
    }
  );

  // Start service
  server.registerTool(
    'start-service',
    {
      title: 'Start Service',
      description: 'Start a service. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the service to start')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.startService(args.uuid),
        'start service'
      );
    }
  );

  // Stop service
  server.registerTool(
    'stop-service',
    {
      title: 'Stop Service',
      description: 'Stop a service. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the service to stop')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.stopService(args.uuid),
        'stop service'
      );
    }
  );

  // Restart service
  server.registerTool(
    'restart-service',
    {
      title: 'Restart Service',
      description: 'Restart a service. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the service to restart')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.restartService(args.uuid),
        'restart service'
      );
    }
  );
}
