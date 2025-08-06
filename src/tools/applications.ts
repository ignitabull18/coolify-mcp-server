/**
 * Application-related MCP tools for Coolify
 */

import { z } from 'zod';
import { CoolifyAPIClient } from '../api-client.js';
import { createToolResponse, safeApiCall } from './utils.js';

export function registerApplicationTools(server: any, apiClient: CoolifyAPIClient) {
  
  // List all applications
  server.registerTool(
    'list-applications',
    {
      title: 'List Applications',
      description: 'Retrieve all applications in your Coolify instance'
    },
    async () => safeApiCall(() => apiClient.listApplications(), 'list applications')
  );

  // Get specific application
  server.registerTool(
    'get-application',
    {
      title: 'Get Application',
      description: 'Get details of a specific application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getApplication(args.uuid),
        'get application details'
      );
    }
  );

  // Create application
  server.registerTool(
    'create-application',
    {
      title: 'Create Application',
      description: 'Create a new application. Requires application configuration data.',
      inputSchema: {
        data: z.object({
          server_uuid: z.string().describe('UUID of the server'),
          project_uuid: z.string().describe('UUID of the project'),
          environment_name: z.string().optional().describe('Environment name (e.g., "production")'),
          name: z.string().describe('Application name'),
          description: z.string().optional().describe('Application description'),
          git_repository: z.string().describe('Git repository URL'),
          git_branch: z.string().optional().describe('Git branch (default: main)'),
          build_pack: z.string().optional().describe('Build pack (nixpacks, dockerfile, static, etc.)'),
          type: z.string().optional().describe('Application type'),
          ports_exposes: z.string().optional().describe('Exposed port (e.g., "3000")'),
          fqdn: z.string().optional().describe('Fully qualified domain name'),
          instant_deploy: z.boolean().optional().describe('Deploy immediately after creation')
        })
      }
    },
    async (args: any) => {
      if (!args.data) {
        return createToolResponse('Error: data parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.createApplication(args.data),
        'create application'
      );
    }
  );

  // Update application
  server.registerTool(
    'update-application',
    {
      title: 'Update Application',
      description: 'Update application configuration. Requires: uuid, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the application'),
        data: z.object({
          name: z.string().optional().describe('Application name'),
          description: z.string().optional().describe('Application description'),
          fqdn: z.string().optional().describe('Fully qualified domain name'),
          git_branch: z.string().optional().describe('Git branch'),
          ports_exposes: z.string().optional().describe('Exposed port')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.updateApplication(args.uuid, args.data),
        'update application'
      );
    }
  );

  // Delete application
  server.registerTool(
    'delete-application',
    {
      title: 'Delete Application',
      description: 'Delete an application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application to delete')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.deleteApplication(args.uuid),
        'delete application'
      );
    }
  );

  // Start application
  server.registerTool(
    'start-application',
    {
      title: 'Start Application',
      description: 'Start an application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application to start')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.startApplication(args.uuid),
        'start application'
      );
    }
  );

  // Stop application
  server.registerTool(
    'stop-application',
    {
      title: 'Stop Application',
      description: 'Stop an application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application to stop')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.stopApplication(args.uuid),
        'stop application'
      );
    }
  );

  // Restart application
  server.registerTool(
    'restart-application',
    {
      title: 'Restart Application',
      description: 'Restart an application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application to restart')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.restartApplication(args.uuid),
        'restart application'
      );
    }
  );

  // Get application logs
  server.registerTool(
    'get-application-logs',
    {
      title: 'Get Application Logs',
      description: 'Get logs for a specific application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getApplicationLogs(args.uuid),
        'get application logs'
      );
    }
  );

  // Deploy application
  server.registerTool(
    'deploy-application',
    {
      title: 'Deploy Application',
      description: 'Trigger deployment for an application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application to deploy')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      const response = await safeApiCall(
        () => apiClient.deployApplication(args.uuid),
        'deploy application'
      );
      
      // Enhanced response with deployment tracking info
      if (!response.isError) {
        return {
          content: [{
            type: 'text',
            text: `🚀 Deployment started for application ${args.uuid}\n\n${response.content[0].text}\n\n💡 Tip: Use 'get-application-logs' to monitor deployment progress.`
          }],
          isError: false
        };
      }
      
      return response;
    }
  );

  // List application deployments
  server.registerTool(
    'list-application-deployments',
    {
      title: 'List Application Deployments',
      description: 'List deployments for a specific application. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the application')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.listApplicationDeployments(args.uuid),
        'list application deployments'
      );
    }
  );
}
