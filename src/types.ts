import { z } from 'zod';

// Base Coolify API Configuration
export interface CoolifyConfig {
  baseUrl: string;
  apiToken: string;
}

// Common Coolify Response Types
export interface CoolifyAPIResponse<T = any> {
  data: T;
  message?: string;
  status?: string;
}

// Application Types
export const ApplicationCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  git_repository: z.string(),
  git_branch: z.string().default('main'),
  build_pack: z.enum(['nixpacks', 'static', 'dockerfile', 'compose']).default('nixpacks'),
  project_uuid: z.string(),
  server_uuid: z.string(),
  environment_name: z.string().default('production')
});

export const DatabaseCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['postgresql', 'mysql', 'mariadb', 'mongodb', 'redis', 'dragonfly', 'keydb', 'clickhouse']),
  project_uuid: z.string(),
  server_uuid: z.string(),
  environment_name: z.string().default('production')
});

export const ServiceCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  project_uuid: z.string(),
  server_uuid: z.string(),
  environment_name: z.string().default('production')
});

export const ServerCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  ip: z.string(),
  port: z.number().default(22),
  user: z.string().default('root'),
  private_key_uuid: z.string()
});

export const ProjectCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export const EnvironmentVariableSchema = z.object({
  key: z.string(),
  value: z.string(),
  is_preview: z.boolean().default(false),
  is_build_time: z.boolean().default(false),
  is_multiline: z.boolean().default(false)
});

// Resource URI Templates
export const ResourceTemplate = {
  APPLICATION: 'coolify://applications/{uuid}',
  DATABASE: 'coolify://databases/{uuid}', 
  SERVICE: 'coolify://services/{uuid}',
  SERVER: 'coolify://servers/{uuid}',
  PROJECT: 'coolify://projects/{uuid}',
  DEPLOYMENT: 'coolify://deployments/{uuid}',
  TEAM: 'coolify://teams/{uuid}',
  PRIVATE_KEY: 'coolify://private-keys/{uuid}'
} as const;

// Common Error Types
export class CoolifyAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'CoolifyAPIError';
  }
}

// Deployment Status Types
export interface DeploymentStatus {
  id: string;
  application_id: string;
  deployment_uuid: string;
  status: 'queued' | 'in_progress' | 'finished' | 'failed' | 'cancelled';
  commit?: string;
  commit_message?: string;
  created_at: string;
  updated_at: string;
}

// Server Resource Types  
export interface ServerResource {
  uuid: string;
  name: string;
  description?: string;
  ip: string;
  port: number;
  user: string;
  validation: {
    uptime?: string;
    docker_version?: string;
    os?: string;
  };
  created_at: string;
  updated_at: string;
}

// Application Resource Types
export interface ApplicationResource {
  uuid: string;
  name: string;
  description?: string;
  git_repository: string;
  git_branch: string;
  build_pack: string;
  fqdn?: string;
  status: string;
  project: {
    uuid: string;
    name: string;
  };
  server: {
    uuid: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}