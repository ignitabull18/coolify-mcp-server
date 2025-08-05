import { CoolifyAPIClient } from './api-client.js';

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
    'get-application',
    {
      title: 'Get Application',
      description: 'Get details of a specific application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.getApplication(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-application',
    {
      title: 'Create Application',
      description: 'Create a new application. Requires: project_uuid, server_uuid, environment_name, git_repository, git_branch, build_pack, ports_exposes'
    },
    async (args: any) => {
      const response = await apiClient.post('/applications', args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-application',
    {
      title: 'Update Application',
      description: 'Update application settings. Requires: uuid. Optional: name, description, git_branch, ports_exposes, domains'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.updateApplication(uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-application',
    {
      title: 'Delete Application',
      description: 'Delete an application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.deleteApplication(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'start-application',
    {
      title: 'Start Application',
      description: 'Start a stopped application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.startApplication(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'stop-application',
    {
      title: 'Stop Application',
      description: 'Stop a running application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.stopApplication(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'restart-application',
    {
      title: 'Restart Application',
      description: 'Restart an application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.restartApplication(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-application-logs',
    {
      title: 'Get Application Logs',
      description: 'Get logs for an application. Requires: uuid. Optional: since, until'
    },
    async (args: any) => {
      const response = await apiClient.getApplicationLogs(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'deploy-application',
    {
      title: 'Deploy Application',
      description: 'Trigger a new deployment for an application. Requires: uuid. Optional: force'
    },
    async (args: any) => {
      const response = await apiClient.get(`/applications/${args.uuid}/deploy`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
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
    'get-database',
    {
      title: 'Get Database',
      description: 'Get details of a specific database. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.getDatabase(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-postgresql',
    {
      title: 'Create PostgreSQL Database',
      description: 'Create a new PostgreSQL database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'postgresql',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-mysql',
    {
      title: 'Create MySQL Database',
      description: 'Create a new MySQL database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'mysql',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-mariadb',
    {
      title: 'Create MariaDB Database',
      description: 'Create a new MariaDB database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'mariadb',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-mongodb',
    {
      title: 'Create MongoDB Database',
      description: 'Create a new MongoDB database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'mongodb',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-redis',
    {
      title: 'Create Redis Database',
      description: 'Create a new Redis database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'redis',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-keydb',
    {
      title: 'Create KeyDB Database',
      description: 'Create a new KeyDB database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'keydb',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-dragonfly',
    {
      title: 'Create DragonFly Database',
      description: 'Create a new DragonFly database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'dragonfly',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-database-clickhouse',
    {
      title: 'Create Clickhouse Database',
      description: 'Create a new Clickhouse database. Requires: project_uuid, server_uuid, environment_name'
    },
    async (args: any) => {
      const response = await apiClient.post('/databases', {
        type: 'clickhouse',
        ...args
      });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-database',
    {
      title: 'Update Database',
      description: 'Update database settings. Requires: uuid. Optional: name, description, image, is_public, public_port'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.updateDatabase(uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-database',
    {
      title: 'Delete Database',
      description: 'Delete a database. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.deleteDatabase(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'start-database',
    {
      title: 'Start Database',
      description: 'Start a stopped database. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.startDatabase(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'stop-database',
    {
      title: 'Stop Database',
      description: 'Stop a running database. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.stopDatabase(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'restart-database',
    {
      title: 'Restart Database',
      description: 'Restart a database. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.restartDatabase(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // SERVICES - Complete CRUD + Operations
  // ============================================

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
    'get-service',
    {
      title: 'Get Service',
      description: 'Get details of a specific service. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.getService(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-service',
    {
      title: 'Create Service',
      description: 'Create a new service from a template. Requires: project_uuid, server_uuid, environment_name, type (e.g., plausible, umami, wordpress)'
    },
    async (args: any) => {
      const response = await apiClient.post('/services', args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-service',
    {
      title: 'Update Service',
      description: 'Update service settings. Requires: uuid. Optional: name, description, domains'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.updateService(uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-service',
    {
      title: 'Delete Service',
      description: 'Delete a service. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.deleteService(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'start-service',
    {
      title: 'Start Service',
      description: 'Start a stopped service. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.startService(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'stop-service',
    {
      title: 'Stop Service',
      description: 'Stop a running service. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.stopService(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'restart-service',
    {
      title: 'Restart Service',
      description: 'Restart a service. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.restartService(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
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
    'get-server',
    {
      title: 'Get Server',
      description: 'Get details of a specific server. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.getServer(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-server',
    {
      title: 'Create Server',
      description: 'Create a new server. Requires: name, ip, private_key_uuid. Optional: description, port, user'
    },
    async (args: any) => {
      const response = await apiClient.createServer(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-server',
    {
      title: 'Update Server',
      description: 'Update server settings. Requires: uuid. Optional: name, description, ip, port, user'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.updateServer(uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-server',
    {
      title: 'Delete Server',
      description: 'Delete a server. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.deleteServer(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'validate-server',
    {
      title: 'Validate Server',
      description: 'Validate server connection and configuration. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/servers/${args.uuid}/validate`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-server-resources',
    {
      title: 'Get Server Resources',
      description: 'Get all resources (apps, databases, services) on a server. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/servers/${args.uuid}/resources`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-server-domains',
    {
      title: 'Get Server Domains',
      description: 'Get all domains configured on a server. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/servers/${args.uuid}/domains`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // PROJECTS - Complete CRUD + Operations
  // ============================================

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
    'get-project',
    {
      title: 'Get Project',
      description: 'Get details of a specific project. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.getProject(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-project',
    {
      title: 'Create Project',
      description: 'Create a new project. Requires: name. Optional: description'
    },
    async (args: any) => {
      const response = await apiClient.createProject(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-project',
    {
      title: 'Update Project',
      description: 'Update project settings. Requires: uuid. Optional: name, description'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.updateProject(uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-project',
    {
      title: 'Delete Project',
      description: 'Delete a project. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.deleteProject(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-project-environment',
    {
      title: 'Get Project Environment',
      description: 'Get environment details for a project. Requires: uuid, environment'
    },
    async (args: any) => {
      const response = await apiClient.get(`/projects/${args.uuid}/environments/${args.environment}`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // DEPLOYMENTS
  // ============================================

  server.registerTool(
    'list-deployments',
    {
      title: 'List Deployments',
      description: 'List all deployments'
    },
    async () => {
      const response = await apiClient.get('/deployments');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-deployment',
    {
      title: 'Get Deployment',
      description: 'Get details of a specific deployment. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/deployments/${args.uuid}`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list-application-deployments',
    {
      title: 'List Application Deployments',
      description: 'List all deployments for a specific application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/applications/${args.uuid}/deployments`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // ENVIRONMENT VARIABLES
  // ============================================

  server.registerTool(
    'list-application-envs',
    {
      title: 'List Application Environment Variables',
      description: 'List all environment variables for an application. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.listApplicationEnvs(args.uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-application-env',
    {
      title: 'Create Application Environment Variable',
      description: 'Create a new environment variable for an application. Requires: uuid, key, value'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.createApplicationEnv(uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-application-env',
    {
      title: 'Update Application Environment Variable',
      description: 'Update an environment variable for an application. Requires: uuid, env_uuid. Optional: key, value'
    },
    async (args: any) => {
      const { uuid, env_uuid, ...data } = args;
      const response = await apiClient.updateApplicationEnv(uuid, env_uuid, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-application-env',
    {
      title: 'Delete Application Environment Variable',
      description: 'Delete an environment variable from an application. Requires: uuid, env_uuid'
    },
    async (args: any) => {
      const response = await apiClient.deleteApplicationEnv(args.uuid, args.env_uuid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-application-envs-bulk',
    {
      title: 'Bulk Update Application Environment Variables',
      description: 'Update multiple environment variables at once. Requires: uuid, envs (KEY=VALUE format, one per line)'
    },
    async (args: any) => {
      const response = await apiClient.patch(`/applications/${args.uuid}/envs`, { data: args.envs });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // Service Environment Variables
  server.registerTool(
    'list-service-envs',
    {
      title: 'List Service Environment Variables',
      description: 'List all environment variables for a service. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/services/${args.uuid}/envs`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-service-env',
    {
      title: 'Create Service Environment Variable',
      description: 'Create a new environment variable for a service. Requires: uuid, key, value'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.post(`/services/${uuid}/envs`, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-service-env',
    {
      title: 'Update Service Environment Variable',
      description: 'Update an environment variable for a service. Requires: uuid, env_uuid. Optional: key, value'
    },
    async (args: any) => {
      const { uuid, env_uuid, ...data } = args;
      const response = await apiClient.patch(`/services/${uuid}/envs/${env_uuid}`, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-service-env',
    {
      title: 'Delete Service Environment Variable',
      description: 'Delete an environment variable from a service. Requires: uuid, env_uuid'
    },
    async (args: any) => {
      const response = await apiClient.delete(`/services/${args.uuid}/envs/${args.env_uuid}`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-service-envs-bulk',
    {
      title: 'Bulk Update Service Environment Variables',
      description: 'Update multiple environment variables at once. Requires: uuid, envs (KEY=VALUE format, one per line)'
    },
    async (args: any) => {
      const response = await apiClient.patch(`/services/${args.uuid}/envs`, { data: args.envs });
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
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
    'get-team',
    {
      title: 'Get Team',
      description: 'Get details of a specific team. Requires: id'
    },
    async (args: any) => {
      const response = await apiClient.get(`/teams/${args.id}`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-team-members',
    {
      title: 'Get Team Members',
      description: 'Get members of a specific team. Requires: id'
    },
    async (args: any) => {
      const response = await apiClient.get(`/teams/${args.id}/members`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-authenticated-team',
    {
      title: 'Get Authenticated Team',
      description: 'Get the team of the authenticated user'
    },
    async () => {
      const response = await apiClient.get('/teams/current');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-authenticated-team-members',
    {
      title: 'Get Authenticated Team Members',
      description: 'Get members of the authenticated user\'s team'
    },
    async () => {
      const response = await apiClient.get('/teams/current/members');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // PRIVATE KEYS
  // ============================================

  server.registerTool(
    'list-private-keys',
    {
      title: 'List Private Keys',
      description: 'List all private keys'
    },
    async () => {
      const response = await apiClient.get('/security/keys');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'get-private-key',
    {
      title: 'Get Private Key',
      description: 'Get details of a specific private key. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.get(`/security/keys/${args.uuid}`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'create-private-key',
    {
      title: 'Create Private Key',
      description: 'Create a new private key. Requires: name, private_key. Optional: description'
    },
    async (args: any) => {
      const response = await apiClient.post('/security/keys', args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'update-private-key',
    {
      title: 'Update Private Key',
      description: 'Update a private key. Requires: uuid. Optional: name, description, private_key'
    },
    async (args: any) => {
      const { uuid, ...data } = args;
      const response = await apiClient.patch(`/security/keys/${uuid}`, data);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'delete-private-key',
    {
      title: 'Delete Private Key',
      description: 'Delete a private key. Requires: uuid'
    },
    async (args: any) => {
      const response = await apiClient.delete(`/security/keys/${args.uuid}`);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // RESOURCES
  // ============================================

  server.registerTool(
    'list-resources',
    {
      title: 'List Resources',
      description: 'List all resources (applications, databases, services)'
    },
    async () => {
      const response = await apiClient.get('/resources');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  // ============================================
  // SYSTEM
  // ============================================

  server.registerTool(
    'get-version',
    {
      title: 'Get Version',
      description: 'Get Coolify version'
    },
    async () => {
      const response = await apiClient.get('/version');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'enable-api',
    {
      title: 'Enable API',
      description: 'Enable the Coolify API'
    },
    async () => {
      const response = await apiClient.get('/enable');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'disable-api',
    {
      title: 'Disable API',
      description: 'Disable the Coolify API'
    },
    async () => {
      const response = await apiClient.get('/disable');
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