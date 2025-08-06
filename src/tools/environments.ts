/**
 * Environment variable MCP tools for Coolify
 */

import { z } from 'zod';
import { CoolifyAPIClient } from '../api-client.js';
import { createToolResponse, safeApiCall } from './utils.js';

export function registerEnvironmentTools(server: any, apiClient: CoolifyAPIClient) {
  
  // ============================================
  // APPLICATION ENVIRONMENT VARIABLES
  // ============================================
  
  // List application environment variables
  server.registerTool(
    'list-application-envs',
    {
      title: 'List Application Environment Variables',
      description: 'List environment variables for a specific application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.listApplicationEnvs(args.uuid),
        'list application environment variables'
      );
    }
  );

  // Create application environment variable
  server.registerTool(
    'create-application-env',
    {
      title: 'Create Application Environment Variable',
      description: 'Create environment variable for an application. Requires: uuid, data.',
      inputSchema: {
        uuid: z.string().describe('UUID of the application'),
        data: z.object({
          key: z.string().describe('Environment variable key'),
          value: z.string().describe('Environment variable value'),
          is_build_time: z.boolean().optional().describe('Whether this is a build-time variable')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.createApplicationEnv(args.uuid, args.data),
        'create application environment variable'
      );
    }
  );

  // Update application environment variable
  server.registerTool(
    'update-application-env',
    {
      title: 'Update Application Environment Variable',
      description: 'Update environment variable for an application. Requires: uuid, envId, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the application'),
        envId: z.string().describe('ID of the environment variable'),
        data: z.object({
          key: z.string().optional().describe('Environment variable key'),
          value: z.string().optional().describe('Environment variable value'),
          is_build_time: z.boolean().optional().describe('Whether this is a build-time variable')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.envId || !args.data) {
        return createToolResponse('Error: uuid, envId, and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.updateApplicationEnv(args.uuid, args.envId, args.data),
        'update application environment variable'
      );
    }
  );

  // Delete application environment variable
  server.registerTool(
    'delete-application-env',
    {
      title: 'Delete Application Environment Variable',
      description: 'Delete environment variable for an application. Requires: uuid, envId',
      inputSchema: {
        uuid: z.string().describe('UUID of the application'),
        envId: z.string().describe('ID of the environment variable to delete')
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.envId) {
        return createToolResponse('Error: uuid and envId parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.deleteApplicationEnv(args.uuid, args.envId),
        'delete application environment variable'
      );
    }
  );

  // ============================================
  // SERVICE ENVIRONMENT VARIABLES
  // ============================================
  
  // List service environment variables
  server.registerTool(
    'list-service-envs',
    {
      title: 'List Service Environment Variables',
      description: 'List environment variables for a specific service. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the service')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.listServiceEnvs(args.uuid),
        'list service environment variables'
      );
    }
  );

  // Create service environment variable
  server.registerTool(
    'create-service-env',
    {
      title: 'Create Service Environment Variable',
      description: 'Create environment variable for a service. Requires: uuid, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the service'),
        data: z.object({
          key: z.string().describe('Environment variable key'),
          value: z.string().describe('Environment variable value')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.createServiceEnv(args.uuid, args.data),
        'create service environment variable'
      );
    }
  );

  // Update service environment variable
  server.registerTool(
    'update-service-env',
    {
      title: 'Update Service Environment Variable',
      description: 'Update environment variable for a service. Requires: uuid, envId, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the service'),
        envId: z.string().describe('ID of the environment variable'),
        data: z.object({
          key: z.string().optional().describe('Environment variable key'),
          value: z.string().optional().describe('Environment variable value')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.envId || !args.data) {
        return createToolResponse('Error: uuid, envId, and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.updateServiceEnv(args.uuid, args.envId, args.data),
        'update service environment variable'
      );
    }
  );

  // Delete service environment variable
  server.registerTool(
    'delete-service-env',
    {
      title: 'Delete Service Environment Variable',
      description: 'Delete environment variable for a service. Requires: uuid, envId',
      inputSchema: {
        uuid: z.string().describe('UUID of the service'),
        envId: z.string().describe('ID of the environment variable to delete')
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.envId) {
        return createToolResponse('Error: uuid and envId parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.deleteServiceEnv(args.uuid, args.envId),
        'delete service environment variable'
      );
    }
  );
}
