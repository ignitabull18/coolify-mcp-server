/**
 * Infrastructure-related MCP tools (Projects, Servers, Teams, etc.)
 */

import { z } from 'zod';
import { CoolifyAPIClient } from '../api-client.js';
import { createToolResponse, safeApiCall } from './utils.js';

export function registerInfrastructureTools(server: any, apiClient: CoolifyAPIClient) {
  
  // ============================================
  // PROJECTS
  // ============================================
  
  server.registerTool(
    'list-projects',
    {
      title: 'List Projects',
      description: 'Retrieve all projects in your Coolify instance'
    },
    async () => safeApiCall(() => apiClient.listProjects(), 'list projects')
  );

  server.registerTool(
    'get-project',
    {
      title: 'Get Project',
      description: 'Get details of a specific project. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the project')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getProject(args.uuid),
        'get project details'
      );
    }
  );

  server.registerTool(
    'create-project',
    {
      title: 'Create Project',
      description: 'Create a new project. Requires: data',
      inputSchema: {
        data: z.object({
          name: z.string().describe('Project name'),
          description: z.string().optional().describe('Project description')
        })
      }
    },
    async (args: any) => {
      if (!args.data) {
        return createToolResponse('Error: data parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.createProject(args.data),
        'create project'
      );
    }
  );

  server.registerTool(
    'update-project',
    {
      title: 'Update Project',
      description: 'Update project configuration. Requires: uuid, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the project'),
        data: z.object({
          name: z.string().optional().describe('Project name'),
          description: z.string().optional().describe('Project description')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.updateProject(args.uuid, args.data),
        'update project'
      );
    }
  );

  server.registerTool(
    'delete-project',
    {
      title: 'Delete Project',
      description: 'Delete a project. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the project to delete')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.deleteProject(args.uuid),
        'delete project'
      );
    }
  );

  server.registerTool(
    'get-project-environment',
    {
      title: 'Get Project Environment',
      description: 'Get environment details for a project. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the project')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getProjectEnvironment(args.uuid),
        'get project environment'
      );
    }
  );

  // ============================================
  // SERVERS
  // ============================================
  
  server.registerTool(
    'list-servers',
    {
      title: 'List Servers',
      description: 'Retrieve all servers in your Coolify instance'
    },
    async () => safeApiCall(() => apiClient.listServers(), 'list servers')
  );

  server.registerTool(
    'get-server',
    {
      title: 'Get Server',
      description: 'Get details of a specific server. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the server')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getServer(args.uuid),
        'get server details'
      );
    }
  );

  server.registerTool(
    'create-server',
    {
      title: 'Create Server',
      description: 'Create a new server. Requires: data',
      inputSchema: {
        data: z.object({
          name: z.string().describe('Server name'),
          ip: z.string().describe('Server IP address'),
          port: z.number().optional().describe('SSH port (default: 22)'),
          user: z.string().optional().describe('SSH user (default: root)'),
          private_key: z.string().optional().describe('SSH private key')
        })
      }
    },
    async (args: any) => {
      if (!args.data) {
        return createToolResponse('Error: data parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.createServer(args.data),
        'create server'
      );
    }
  );

  server.registerTool(
    'update-server',
    {
      title: 'Update Server',
      description: 'Update server configuration. Requires: uuid, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the server'),
        data: z.object({
          name: z.string().optional().describe('Server name'),
          ip: z.string().optional().describe('Server IP address'),
          port: z.number().optional().describe('SSH port')
        })
      }
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      return safeApiCall(
        () => apiClient.updateServer(args.uuid, args.data),
        'update server'
      );
    }
  );

  server.registerTool(
    'delete-server',
    {
      title: 'Delete Server',
      description: 'Delete a server. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the server to delete')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.deleteServer(args.uuid),
        'delete server'
      );
    }
  );

  server.registerTool(
    'get-server-resources',
    {
      title: 'Get Server Resources',
      description: 'Get resource usage for a server. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the server')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getServerResources(args.uuid),
        'get server resources'
      );
    }
  );

  server.registerTool(
    'get-server-domains',
    {
      title: 'Get Server Domains',
      description: 'Get domains configured on a server. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the server')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getServerDomains(args.uuid),
        'get server domains'
      );
    }
  );

  server.registerTool(
    'validate-server',
    {
      title: 'Validate Server',
      description: 'Validate server connection and configuration. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the server')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.validateServer(args.uuid),
        'validate server'
      );
    }
  );

  // ============================================
  // TEAMS
  // ============================================
  
  server.registerTool(
    'list-teams',
    {
      title: 'List Teams',
      description: 'Retrieve all teams in your Coolify instance'
    },
    async () => safeApiCall(() => apiClient.listTeams(), 'list teams')
  );

  server.registerTool(
    'get-team',
    {
      title: 'Get Team',
      description: 'Get details of a specific team. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the team')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getTeam(args.uuid),
        'get team details'
      );
    }
  );

  server.registerTool(
    'get-team-members',
    {
      title: 'Get Team Members',
      description: 'Get members of a specific team. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the team')
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      return safeApiCall(
        () => apiClient.getTeamMembers(args.uuid),
        'get team members'
      );
    }
  );

  server.registerTool(
    'get-authenticated-team',
    {
      title: 'Get Authenticated Team',
      description: 'Get the authenticated team details'
    },
    async () => safeApiCall(
      () => apiClient.getAuthenticatedTeam(),
      'get authenticated team'
    )
  );

  server.registerTool(
    'get-authenticated-team-members',
    {
      title: 'Get Authenticated Team Members',
      description: 'Get members of the authenticated team'
    },
    async () => safeApiCall(
      () => apiClient.getAuthenticatedTeamMembers(),
      'get authenticated team members'
    )
  );
}
