import { CoolifyAPIClient } from './api-client.js';

// Helper function to safely format tool response
function createToolResponse(data: any, isError: boolean = false): any {
  let responseText: string;
  
  try {
    if (data === null || data === undefined) {
      responseText = isError ? 'Error: No data received from API' : 'No data available';
    } else if (typeof data === 'string') {
      responseText = data;
    } else {
      responseText = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    responseText = `Error formatting response: ${error instanceof Error ? error.message : 'Unknown error'}`;
    isError = true;
  }

  return {
    content: [{
      type: 'text',
      text: responseText
    }],
    isError
  };
}

// Helper function to safely call API and handle errors
async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  operation: string
): Promise<any> {
  try {
    const response = await apiCall();
    return createToolResponse(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createToolResponse(`Failed to ${operation}: ${errorMessage}`, true);
  }
}

export function registerCoolifyTools(server: any, apiClient: CoolifyAPIClient) {
  
  // ============================================
  // APPLICATIONS - Complete CRUD + Operations
  // ============================================
  
  server.registerTool(
    'list-applications',
    {
      title: 'List Applications',
      description: 'Retrieve all applications in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listApplications(),
        'list applications'
      );
    }
  );

  server.registerTool(
    'get-application',
    {
      title: 'Get Application',
      description: 'Get details of a specific application. Requires: uuid'
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

  server.registerTool(
    'health-check',
    {
      title: 'Health Check',
      description: 'Check the health status of the Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.healthCheck(),
        'perform health check'
      );
    }
  );

  server.registerTool(
    'list-projects',
    {
      title: 'List Projects',
      description: 'Retrieve all projects in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listProjects(),
        'list projects'
      );
    }
  );

  server.registerTool(
    'list-services',
    {
      title: 'List Services',
      description: 'Retrieve all services in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listServices(),
        'list services'
      );
    }
  );

  server.registerTool(
    'list-resources',
    {
      title: 'List Resources',
      description: 'List all resources (applications, databases, services)'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listResources(),
        'list resources'
      );
    }
  );

  // ============================================
  // DATABASES - Complete CRUD + Operations
  // ============================================
  
  server.registerTool(
    'list-databases',
    {
      title: 'List Databases',
      description: 'Retrieve all databases in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listDatabases(),
        'list databases'
      );
    }
  );

  server.registerTool(
    'get-database',
    {
      title: 'Get Database',
      description: 'Get details of a specific database. Requires: uuid',
      inputSchema: {
        type: 'object',
        properties: {
          uuid: {
            type: 'string',
            description: 'UUID of the database to retrieve'
          }
        },
        required: ['uuid']
      }
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.getDatabase(args.uuid),
        'get database details'
      );
    }
  );

  server.registerTool(
    'create-database',
    {
      title: 'Create Database',
      description: 'Create a new database. Requires database configuration data. Example data: {"server_uuid": "server-id", "project_uuid": "project-id", "name": "my-db", "image": "postgres:15", "postgres_user": "user", "postgres_password": "password", "postgres_db": "dbname"}'
    },
    async (args: any) => {
      if (!args.data) {
        return createToolResponse('Error: data parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.createDatabase(args.data),
        'create database'
      );
    }
  );

  server.registerTool(
    'update-database',
    {
      title: 'Update Database',
      description: 'Update database configuration. Requires: uuid, data'
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      
      return safeApiCall(
        () => apiClient.updateDatabase(args.uuid, args.data),
        'update database'
      );
    }
  );

  server.registerTool(
    'delete-database',
    {
      title: 'Delete Database',
      description: 'Delete a database. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.deleteDatabase(args.uuid),
        'delete database'
      );
    }
  );

  server.registerTool(
    'start-database',
    {
      title: 'Start Database',
      description: 'Start a database. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.startDatabase(args.uuid),
        'start database'
      );
    }
  );

  server.registerTool(
    'stop-database',
    {
      title: 'Stop Database',
      description: 'Stop a database. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.stopDatabase(args.uuid),
        'stop database'
      );
    }
  );

  server.registerTool(
    'restart-database',
    {
      title: 'Restart Database',
      description: 'Restart a database. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.restartDatabase(args.uuid),
        'restart database'
      );
    }
  );

  // ============================================
  // SERVICES - Complete CRUD + Operations
  // ============================================
  
  server.registerTool(
    'get-service',
    {
      title: 'Get Service',
      description: 'Get details of a specific service. Requires: uuid'
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

  server.registerTool(
    'create-service',
    {
      title: 'Create Service',
      description: 'Create a new service. Requires service configuration data'
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

  server.registerTool(
    'update-service',
    {
      title: 'Update Service',
      description: 'Update service configuration. Requires: uuid, data'
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

  server.registerTool(
    'delete-service',
    {
      title: 'Delete Service',
      description: 'Delete a service. Requires: uuid'
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

  server.registerTool(
    'start-service',
    {
      title: 'Start Service',
      description: 'Start a service. Requires: uuid'
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

  server.registerTool(
    'stop-service',
    {
      title: 'Stop Service',
      description: 'Stop a service. Requires: uuid'
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

  server.registerTool(
    'restart-service',
    {
      title: 'Restart Service',
      description: 'Restart a service. Requires: uuid'
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

  // ============================================
  // SERVERS - Complete CRUD + Operations
  // ============================================
  
  server.registerTool(
    'list-servers',
    {
      title: 'List Servers',
      description: 'Retrieve all servers in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listServers(),
        'list servers'
      );
    }
  );

  server.registerTool(
    'get-server',
    {
      title: 'Get Server',
      description: 'Get details of a specific server. Requires: uuid'
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
      description: 'Create a new server. Requires server configuration data'
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
      description: 'Update server configuration. Requires: uuid, data'
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
      description: 'Delete a server. Requires: uuid'
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
      description: 'Get resources for a specific server. Requires: uuid'
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
      description: 'Get domains for a specific server. Requires: uuid'
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
      description: 'Validate server configuration. Requires: uuid'
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
  // PROJECTS - Complete CRUD + Operations
  // ============================================
  
  server.registerTool(
    'get-project',
    {
      title: 'Get Project',
      description: 'Get details of a specific project. Requires: uuid'
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
      description: 'Create a new project. Requires project configuration data'
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
      description: 'Update project configuration. Requires: uuid, data'
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
      description: 'Delete a project. Requires: uuid'
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
      description: 'Get environment for a specific project. Requires: uuid'
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
  // DEPLOYMENTS - Operations
  // ============================================
  
  server.registerTool(
    'list-deployments',
    {
      title: 'List Deployments',
      description: 'Retrieve all deployments in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listDeployments(),
        'list deployments'
      );
    }
  );

  server.registerTool(
    'get-deployment',
    {
      title: 'Get Deployment',
      description: 'Get details of a specific deployment. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.getDeployment(args.uuid),
        'get deployment details'
      );
    }
  );

  server.registerTool(
    'deploy-application',
    {
      title: 'Deploy Application',
      description: 'Deploy an application. This will trigger a new deployment with the latest code from the configured git repository. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      // Add notification for long-running operation
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

  server.registerTool(
    'list-application-deployments',
    {
      title: 'List Application Deployments',
      description: 'List deployments for a specific application. Requires: uuid'
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

  // ============================================
  // TEAMS - Operations
  // ============================================
  
  server.registerTool(
    'list-teams',
    {
      title: 'List Teams',
      description: 'Retrieve all teams in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listTeams(),
        'list teams'
      );
    }
  );

  server.registerTool(
    'get-team',
    {
      title: 'Get Team',
      description: 'Get details of a specific team. Requires: uuid'
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
      description: 'Get members of a specific team. Requires: uuid'
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
      description: 'Get the currently authenticated team details'
    },
    async () => {
      return safeApiCall(
        () => apiClient.getAuthenticatedTeam(),
        'get authenticated team'
      );
    }
  );

  server.registerTool(
    'get-authenticated-team-members',
    {
      title: 'Get Authenticated Team Members',
      description: 'Get members of the currently authenticated team'
    },
    async () => {
      return safeApiCall(
        () => apiClient.getAuthenticatedTeamMembers(),
        'get authenticated team members'
      );
    }
  );

  // ============================================
  // PRIVATE KEYS - Complete CRUD
  // ============================================
  
  server.registerTool(
    'list-private-keys',
    {
      title: 'List Private Keys',
      description: 'Retrieve all private keys in your Coolify instance'
    },
    async () => {
      return safeApiCall(
        () => apiClient.listPrivateKeys(),
        'list private keys'
      );
    }
  );

  server.registerTool(
    'get-private-key',
    {
      title: 'Get Private Key',
      description: 'Get details of a specific private key. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.getPrivateKey(args.uuid),
        'get private key details'
      );
    }
  );

  server.registerTool(
    'create-private-key',
    {
      title: 'Create Private Key',
      description: 'Create a new private key. Requires private key data'
    },
    async (args: any) => {
      if (!args.data) {
        return createToolResponse('Error: data parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.createPrivateKey(args.data),
        'create private key'
      );
    }
  );

  server.registerTool(
    'update-private-key',
    {
      title: 'Update Private Key',
      description: 'Update private key configuration. Requires: uuid, data'
    },
    async (args: any) => {
      if (!args.uuid || !args.data) {
        return createToolResponse('Error: uuid and data parameters are required', true);
      }
      
      return safeApiCall(
        () => apiClient.updatePrivateKey(args.uuid, args.data),
        'update private key'
      );
    }
  );

  server.registerTool(
    'delete-private-key',
    {
      title: 'Delete Private Key',
      description: 'Delete a private key. Requires: uuid'
    },
    async (args: any) => {
      if (!args.uuid) {
        return createToolResponse('Error: uuid parameter is required', true);
      }
      
      return safeApiCall(
        () => apiClient.deletePrivateKey(args.uuid),
        'delete private key'
      );
    }
  );

  // ============================================
  // APPLICATION OPERATIONS - Extended
  // ============================================
  
  server.registerTool(
    'create-application',
    {
      title: 'Create Application',
      description: 'Create a new application. Requires application configuration data. Example data: {"server_uuid": "server-id", "project_uuid": "project-id", "name": "my-app", "git_repository": "https://github.com/user/repo", "git_branch": "main", "build_pack": "nixpacks", "ports_exposes": "3000"}'
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

  server.registerTool(
    'update-application',
    {
      title: 'Update Application',
      description: 'Update application configuration. Requires: uuid, data'
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

  server.registerTool(
    'delete-application',
    {
      title: 'Delete Application',
      description: 'Delete an application. Requires: uuid'
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

  server.registerTool(
    'get-application-logs',
    {
      title: 'Get Application Logs',
      description: 'Get logs for a specific application. Requires: uuid'
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

  server.registerTool(
    'start-application',
    {
      title: 'Start Application',
      description: 'Start an application. Requires: uuid'
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

  server.registerTool(
    'stop-application',
    {
      title: 'Stop Application',
      description: 'Stop an application. Requires: uuid'
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

  server.registerTool(
    'restart-application',
    {
      title: 'Restart Application',
      description: 'Restart an application. Requires: uuid'
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

  // ============================================
  // APPLICATION ENVIRONMENT VARIABLES
  // ============================================
  
  server.registerTool(
    'list-application-envs',
    {
      title: 'List Application Environment Variables',
      description: 'List environment variables for a specific application. Requires: uuid'
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

  server.registerTool(
    'create-application-env',
    {
      title: 'Create Application Environment Variable',
      description: 'Create environment variable for an application. Requires: uuid, data. Example data: {"key": "NODE_ENV", "value": "production", "is_build_time": false}'
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

  server.registerTool(
    'update-application-env',
    {
      title: 'Update Application Environment Variable',
      description: 'Update environment variable for an application. Requires: uuid, envId, data'
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

  server.registerTool(
    'delete-application-env',
    {
      title: 'Delete Application Environment Variable',
      description: 'Delete environment variable for an application. Requires: uuid, envId'
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
  
  server.registerTool(
    'list-service-envs',
    {
      title: 'List Service Environment Variables',
      description: 'List environment variables for a specific service. Requires: uuid'
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

  server.registerTool(
    'create-service-env',
    {
      title: 'Create Service Environment Variable',
      description: 'Create environment variable for a service. Requires: uuid, data'
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

  server.registerTool(
    'update-service-env',
    {
      title: 'Update Service Environment Variable',
      description: 'Update environment variable for a service. Requires: uuid, envId, data'
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

  server.registerTool(
    'delete-service-env',
    {
      title: 'Delete Service Environment Variable',
      description: 'Delete environment variable for a service. Requires: uuid, envId'
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

  // ============================================
  // GENERAL/UTILITY TOOLS
  // ============================================
  
  server.registerTool(
    'get-version',
    {
      title: 'Get Coolify Version',
      description: 'Get the current Coolify version information'
    },
    async () => {
      return safeApiCall(
        () => apiClient.getVersion(),
        'get Coolify version'
      );
    }
  );
}
