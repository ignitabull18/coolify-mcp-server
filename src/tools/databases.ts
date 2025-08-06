/**
 * Database-related MCP tools for Coolify
 */

import { z } from 'zod';
import { CoolifyAPIClient } from '../api-client.js';
import { createToolResponse, safeApiCall } from './utils.js';

export function registerDatabaseTools(server: any, apiClient: CoolifyAPIClient) {
  
  // List all databases
  server.registerTool(
    'list-databases',
    {
      title: 'List Databases',
      description: 'Retrieve all databases in your Coolify instance'
    },
    async () => safeApiCall(() => apiClient.listDatabases(), 'list databases')
  );

  // Get specific database
  server.registerTool(
    'get-database',
    {
      title: 'Get Database',
      description: 'Get details of a specific database. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the database')
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

  // Create database
  server.registerTool(
    'create-database',
    {
      title: 'Create Database',
      description: 'Create a new database. Requires database configuration data.',
      inputSchema: {
        data: z.object({
          server_uuid: z.string().describe('UUID of the server'),
          project_uuid: z.string().describe('UUID of the project'),
          environment_name: z.string().optional().describe('Environment name'),
          name: z.string().describe('Database name'),
          description: z.string().optional().describe('Database description'),
          image: z.string().describe('Database image (e.g., postgres:15, mysql:8.0)'),
          type: z.string().optional().describe('Database type (postgresql, mysql, mongodb, redis)'),
          postgres_user: z.string().optional().describe('PostgreSQL username'),
          postgres_password: z.string().optional().describe('PostgreSQL password'),
          postgres_db: z.string().optional().describe('PostgreSQL database name'),
          mysql_root_password: z.string().optional().describe('MySQL root password'),
          mysql_user: z.string().optional().describe('MySQL username'),
          mysql_password: z.string().optional().describe('MySQL password'),
          mysql_database: z.string().optional().describe('MySQL database name'),
          instant_deploy: z.boolean().optional().describe('Deploy immediately after creation')
        })
      }
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

  // Update database
  server.registerTool(
    'update-database',
    {
      title: 'Update Database',
      description: 'Update database configuration. Requires: uuid, data',
      inputSchema: {
        uuid: z.string().describe('UUID of the database'),
        data: z.object({
          name: z.string().optional().describe('Database name'),
          description: z.string().optional().describe('Database description')
        })
      }
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

  // Delete database
  server.registerTool(
    'delete-database',
    {
      title: 'Delete Database',
      description: 'Delete a database. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the database to delete')
      }
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

  // Start database
  server.registerTool(
    'start-database',
    {
      title: 'Start Database',
      description: 'Start a database. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the database to start')
      }
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

  // Stop database
  server.registerTool(
    'stop-database',
    {
      title: 'Stop Database',
      description: 'Stop a database. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the database to stop')
      }
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

  // Restart database
  server.registerTool(
    'restart-database',
    {
      title: 'Restart Database',
      description: 'Restart a database. Requires: uuid',
      inputSchema: {
        uuid: z.string().describe('UUID of the database to restart')
      }
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
}
