import { CoolifyAPIClient } from './api-client.js';

export function registerCoolifyTools(server: any, apiClient: CoolifyAPIClient) {
  
  // Simple tools without complex schemas for now
  
  server.registerTool(
    'list-applications',
    {
      title: 'List Applications',
      description: 'Retrieve all applications in your Coolify instance'
    },
    async () => {
      const response = await apiClient.listApplications();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list-databases',
    {
      title: 'List Databases',
      description: 'Retrieve all databases in your Coolify instance'
    },
    async () => {
      const response = await apiClient.listDatabases();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list-services',
    {
      title: 'List Services',
      description: 'Retrieve all services in your Coolify instance'
    },
    async () => {
      const response = await apiClient.listServices();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list-servers',
    {
      title: 'List Servers',
      description: 'Retrieve all servers in your Coolify instance'
    },
    async () => {
      const response = await apiClient.listServers();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list-projects',
    {
      title: 'List Projects',
      description: 'Retrieve all projects in your Coolify instance'
    },
    async () => {
      const response = await apiClient.listProjects();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list-teams',
    {
      title: 'List Teams',
      description: 'Retrieve all teams in your Coolify instance'
    },
    async () => {
      const response = await apiClient.listTeams();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'health-check',
    {
      title: 'Health Check',
      description: 'Check the health status of the Coolify instance'
    },
    async () => {
      const response = await apiClient.healthCheck();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );
}