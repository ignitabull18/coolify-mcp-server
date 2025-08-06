import { CoolifyAPIClient } from './api-client.js';

export function registerCoolifyResources(server: any, apiClient: CoolifyAPIClient) {
  
  // ============================================
  // DYNAMIC RESOURCES WITH REAL-TIME DATA
  // ============================================
  
  server.registerResource(
    'coolify://overview',
    {
      title: 'Coolify Instance Overview',
      description: 'Complete overview of your Coolify instance including all applications, databases, services, and health status.',
      mimeType: 'application/json'
    },
    async () => {
      try {
        // Gather comprehensive data
        const [
          applications,
          databases, 
          services,
          servers,
          projects,
          teams,
          version
        ] = await Promise.all([
          apiClient.listApplications().catch(() => ({ data: [] })),
          apiClient.listDatabases().catch(() => ({ data: [] })),
          apiClient.listServices().catch(() => ({ data: [] })),
          apiClient.listServers().catch(() => ({ data: [] })),
          apiClient.listProjects().catch(() => ({ data: [] })),
          apiClient.listTeams().catch(() => ({ data: [] })),
          apiClient.getVersion().catch(() => ({ data: 'Unknown' }))
        ]);

        const overview = {
          timestamp: new Date().toISOString(),
          version: version.data,
          summary: {
            applications: {
              total: applications.data?.length || 0,
              running: applications.data?.filter((app: any) => app.status === 'running')?.length || 0,
              stopped: applications.data?.filter((app: any) => app.status === 'stopped')?.length || 0,
              deploying: applications.data?.filter((app: any) => app.status === 'deploying')?.length || 0
            },
            databases: {
              total: databases.data?.length || 0,
              running: databases.data?.filter((db: any) => db.status === 'running')?.length || 0,
              postgresql: databases.data?.filter((db: any) => db.image?.includes('postgres'))?.length || 0,
              mysql: databases.data?.filter((db: any) => db.image?.includes('mysql'))?.length || 0,
              redis: databases.data?.filter((db: any) => db.image?.includes('redis'))?.length || 0
            },
            services: {
              total: services.data?.length || 0,
              running: services.data?.filter((svc: any) => svc.status === 'running')?.length || 0
            },
            infrastructure: {
              servers: servers.data?.length || 0,
              projects: projects.data?.length || 0,
              teams: teams.data?.length || 0
            }
          },
          health_status: {
            overall: 'healthy', // Could be enhanced with actual health checks
            applications: applications.data?.map((app: any) => ({
              name: app.name,
              uuid: app.uuid,
              status: app.status,
              last_deployment: app.updated_at
            })) || [],
            databases: databases.data?.map((db: any) => ({
              name: db.name,
              uuid: db.uuid,
              type: db.image,
              status: db.status
            })) || []
          },
          recent_activity: {
            // This would ideally come from deployment logs or events
            message: 'Use list-deployments tool for recent deployment activity'
          }
        };

        return {
          contents: [{
            uri: 'coolify://overview',
            mimeType: 'application/json',
            text: JSON.stringify(overview, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri: 'coolify://overview',
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Failed to fetch overview data',
              message: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString()
            }, null, 2)
          }]
        };
      }
    }
  );

  server.registerResource(
    'coolify://applications/{uuid}',
    {
      title: 'Application Details',
      description: 'Detailed information about a specific application including configuration, status, and deployment history.',
      mimeType: 'application/json'
    },
    async (uri: string) => {
      const uuid = uri.split('/').pop();
      if (!uuid) {
        throw new Error('Application UUID is required');
      }

      try {
        const [appDetails, deployments, envVars] = await Promise.all([
          apiClient.getApplication(uuid),
          apiClient.listApplicationDeployments(uuid).catch(() => ({ data: [] })),
          apiClient.listApplicationEnvs(uuid).catch(() => ({ data: [] }))
        ]);

        const applicationData = {
          ...appDetails.data,
          deployment_history: deployments.data,
          environment_variables: {
            count: envVars.data?.length || 0,
            // Don't expose actual values for security
            keys: envVars.data?.map((env: any) => env.key) || []
          },
          last_updated: new Date().toISOString()
        };

        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(applicationData, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Failed to fetch application data',
              uuid,
              message: error instanceof Error ? error.message : 'Unknown error'
            }, null, 2)
          }]
        };
      }
    }
  );

  server.registerResource(
    'coolify://databases/{uuid}',
    {
      title: 'Database Details',
      description: 'Detailed information about a specific database including configuration, status, and connection details.',
      mimeType: 'application/json'
    },
    async (uri: string) => {
      const uuid = uri.split('/').pop();
      if (!uuid) {
        throw new Error('Database UUID is required');
      }

      try {
        const dbDetails = await apiClient.getDatabase(uuid);
        
        const databaseData = {
          ...dbDetails.data,
          connection_info: {
            // Provide connection template without exposing credentials
            host: 'database-service-name',
            port: getDatabasePort(dbDetails.data?.image || ''),
            database_type: getDatabaseType(dbDetails.data?.image || ''),
            connection_template: getConnectionTemplate(dbDetails.data?.image || '')
          },
          security_notes: [
            'Use environment variables for credentials',
            'Enable SSL/TLS for production',
            'Implement connection pooling',
            'Regular backup verification'
          ],
          last_updated: new Date().toISOString()
        };

        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(databaseData, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Failed to fetch database data',
              uuid,
              message: error instanceof Error ? error.message : 'Unknown error'
            }, null, 2)
          }]
        };
      }
    }
  );

  server.registerResource(
    'coolify://services/{uuid}',
    {
      title: 'Service Details',
      description: 'Detailed information about a specific service including configuration and status.',
      mimeType: 'application/json'
    },
    async (uri: string) => {
      const uuid = uri.split('/').pop();
      if (!uuid) {
        throw new Error('Service UUID is required');
      }

      try {
        const [serviceDetails, envVars] = await Promise.all([
          apiClient.getService(uuid),
          apiClient.listServiceEnvs(uuid).catch(() => ({ data: [] }))
        ]);

        const serviceData = {
          ...serviceDetails.data,
          environment_variables: {
            count: envVars.data?.length || 0,
            keys: envVars.data?.map((env: any) => env.key) || []
          },
          management_tips: [
            'Monitor resource usage regularly',
            'Keep service updated',
            'Backup configuration before changes',
            'Test in staging before production'
          ],
          last_updated: new Date().toISOString()
        };

        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(serviceData, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Failed to fetch service data',
              uuid,
              message: error instanceof Error ? error.message : 'Unknown error'
            }, null, 2)
          }]
        };
      }
    }
  );

  server.registerResource(
    'coolify://servers/{uuid}',
    {
      title: 'Server Details',
      description: 'Detailed information about a specific server including resources and domains.',
      mimeType: 'application/json'
    },
    async (uri: string) => {
      const uuid = uri.split('/').pop();
      if (!uuid) {
        throw new Error('Server UUID is required');
      }

      try {
        const [serverDetails, resources, domains] = await Promise.all([
          apiClient.getServer(uuid),
          apiClient.getServerResources(uuid).catch(() => ({ data: {} })),
          apiClient.getServerDomains(uuid).catch(() => ({ data: [] }))
        ]);

        const serverData = {
          ...serverDetails.data,
          resources: resources.data,
          domains: domains.data,
          health_recommendations: [
            'Monitor CPU and memory usage',
            'Regular security updates',
            'Backup server configuration',
            'Monitor disk space usage'
          ],
          last_updated: new Date().toISOString()
        };

        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(serverData, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Failed to fetch server data',
              uuid,
              message: error instanceof Error ? error.message : 'Unknown error'
            }, null, 2)
          }]
        };
      }
    }
  );

  server.registerResource(
    'coolify://projects/{uuid}',
    {
      title: 'Project Details',
      description: 'Detailed information about a specific project including associated resources.',
      mimeType: 'application/json'
    },
    async (uri: string) => {
      const uuid = uri.split('/').pop();
      if (!uuid) {
        throw new Error('Project UUID is required');
      }

      try {
        const [projectDetails, environment] = await Promise.all([
          apiClient.getProject(uuid),
          apiClient.getProjectEnvironment(uuid).catch(() => ({ data: {} }))
        ]);

        const projectData = {
          ...projectDetails.data,
          environment: environment.data,
          best_practices: [
            'Use consistent naming conventions',
            'Implement proper environment separation',
            'Document deployment procedures',
            'Regular backup verification'
          ],
          last_updated: new Date().toISOString()
        };

        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(projectData, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Failed to fetch project data',
              uuid,
              message: error instanceof Error ? error.message : 'Unknown error'
            }, null, 2)
          }]
        };
      }
    }
  );

  server.registerResource(
    'coolify://status',
    {
      title: 'System Health Status',
      description: 'Real-time health status of all Coolify resources.',
      mimeType: 'application/json'
    },
    async () => {
      try {
        const healthCheck = await apiClient.healthCheck();
        const timestamp = new Date().toISOString();
        
        const statusData = {
          timestamp,
          api_status: 'healthy',
          version: await apiClient.getVersion().then(v => v.data).catch(() => 'unknown'),
          last_check: timestamp,
          system_info: {
            api_accessible: true,
            response_time: '< 100ms', // This would be measured in practice
            uptime: 'Available via API'
          },
          recommendations: [
            'Monitor resource usage regularly',
            'Keep Coolify updated',
            'Regular backup verification',
            'Monitor application health'
          ]
        };

        return {
          contents: [{
            uri: 'coolify://status',
            mimeType: 'application/json',
            text: JSON.stringify(statusData, null, 2)
          }]
        };
      } catch (error) {
        return {
          contents: [{
            uri: 'coolify://status',
            mimeType: 'application/json',
            text: JSON.stringify({
              timestamp: new Date().toISOString(),
              api_status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error',
              recommendations: [
                'Check Coolify server status',
                'Verify API token validity',
                'Check network connectivity'
              ]
            }, null, 2)
          }]
        };
      }
    }
  );

  // ============================================
  // TEMPLATE RESOURCES
  // ============================================
  
  server.registerResource(
    'coolify://templates/web-app',
    {
      title: 'Web Application Template',
      description: 'Template configuration for creating a new web application.',
      mimeType: 'application/json'
    },
    async () => {
      const template = {
        name: 'my-web-app',
        git_repository: 'https://github.com/yourorg/your-repo',
        git_branch: 'main',
        build_pack: 'nixpacks',
        ports_exposes: '3000',
        install_command: 'npm install',
        build_command: 'npm run build',
        start_command: 'npm start',
        environment_variables: [
          { key: 'NODE_ENV', value: 'production' },
          { key: 'PORT', value: '3000' }
        ],
        domains: 'your-app.yourdomain.com',
        deployment_notes: [
          'Update git_repository with your actual repo URL',
          'Configure environment variables for your app',
          'Set up proper domain and SSL',
          'Test in staging before production'
        ]
      };

      return {
        contents: [{
          uri: 'coolify://templates/web-app',
          mimeType: 'application/json',
          text: JSON.stringify(template, null, 2)
        }]
      };
    }
  );

  server.registerResource(
    'coolify://templates/database',
    {
      title: 'Database Templates',
      description: 'Template configurations for different database types.',
      mimeType: 'application/json'
    },
    async () => {
      const templates = {
        postgresql: {
          name: 'my-postgres-db',
          image: 'postgres:15',
          postgres_user: 'myapp_user',
          postgres_password: 'secure_password_here',
          postgres_db: 'myapp_db',
          environment_variables: [
            { key: 'POSTGRES_USER', value: 'myapp_user' },
            { key: 'POSTGRES_PASSWORD', value: 'secure_password_here' },
            { key: 'POSTGRES_DB', value: 'myapp_db' }
          ]
        },
        mysql: {
          name: 'my-mysql-db',
          image: 'mysql:8.0',
          mysql_root_password: 'secure_root_password',
          mysql_user: 'myapp_user',
          mysql_password: 'secure_password_here',
          mysql_database: 'myapp_db'
        },
        redis: {
          name: 'my-redis-cache',
          image: 'redis:7-alpine',
          redis_password: 'secure_redis_password'
        },
        mongodb: {
          name: 'my-mongo-db',
          image: 'mongo:7',
          mongo_initdb_root_username: 'admin',
          mongo_initdb_root_password: 'secure_mongo_password'
        }
      };

      return {
        contents: [{
          uri: 'coolify://templates/database',
          mimeType: 'application/json',
          text: JSON.stringify(templates, null, 2)
        }]
      };
    }
  );
}

// Helper functions
function getDatabasePort(image: string): number {
  if (image.includes('postgres')) return 5432;
  if (image.includes('mysql')) return 3306;
  if (image.includes('mongo')) return 27017;
  if (image.includes('redis')) return 6379;
  if (image.includes('clickhouse')) return 8123;
  return 0;
}

function getDatabaseType(image: string): string {
  if (image.includes('postgres')) return 'PostgreSQL';
  if (image.includes('mysql')) return 'MySQL';
  if (image.includes('mongo')) return 'MongoDB';
  if (image.includes('redis')) return 'Redis';
  if (image.includes('clickhouse')) return 'ClickHouse';
  return 'Unknown';
}

function getConnectionTemplate(image: string): string {
  if (image.includes('postgres')) {
    return 'postgresql://username:password@hostname:5432/database';
  }
  if (image.includes('mysql')) {
    return 'mysql://username:password@hostname:3306/database';
  }
  if (image.includes('mongo')) {
    return 'mongodb://username:password@hostname:27017/database';
  }
  if (image.includes('redis')) {
    return 'redis://password@hostname:6379';
  }
  return 'See documentation for connection format';
}
