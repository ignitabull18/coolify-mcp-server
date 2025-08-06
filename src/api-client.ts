import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CoolifyConfig, CoolifyAPIResponse, CoolifyAPIError } from './types.js';

export class CoolifyAPIClient {
  private client: AxiosInstance;

  constructor(private config: CoolifyConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000, // 30 second timeout
    });

    // Request interceptor disabled to avoid interfering with MCP protocol
    // this.client.interceptors.request.use(
    //   (config) => {
    //     console.log(`[Coolify API] ${config.method?.toUpperCase()} ${config.url}`);
    //     return config;
    //   },
    //   (error) => Promise.reject(error)
    // );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || 'Unknown API error';
        const statusCode = error.response?.status;
        throw new CoolifyAPIError(message, statusCode, error.response?.data);
      }
    );
  }

  // Generic request methods
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<CoolifyAPIResponse<T>> {
    const response: AxiosResponse<CoolifyAPIResponse<T>> = await this.client.get(endpoint, { params });
    return response.data;
  }

  async post<T = any>(endpoint: string, data?: any): Promise<CoolifyAPIResponse<T>> {
    const response: AxiosResponse<CoolifyAPIResponse<T>> = await this.client.post(endpoint, data);
    return response.data;
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<CoolifyAPIResponse<T>> {
    const response: AxiosResponse<CoolifyAPIResponse<T>> = await this.client.patch(endpoint, data);
    return response.data;
  }

  async put<T = any>(endpoint: string, data?: any): Promise<CoolifyAPIResponse<T>> {
    const response: AxiosResponse<CoolifyAPIResponse<T>> = await this.client.put(endpoint, data);
    return response.data;
  }

  async delete<T = any>(endpoint: string): Promise<CoolifyAPIResponse<T>> {
    const response: AxiosResponse<CoolifyAPIResponse<T>> = await this.client.delete(endpoint);
    return response.data;
  }

  // Specialized API methods

  // ============ APPLICATIONS ============
  async listApplications() {
    return this.get('/applications');
  }

  async getApplication(uuid: string) {
    return this.get(`/applications/${uuid}`);
  }

  async createApplication(data: any) {
    return this.post('/applications', data);
  }

  async updateApplication(uuid: string, data: any) {
    return this.patch(`/applications/${uuid}`, data);
  }

  async deleteApplication(uuid: string) {
    return this.delete(`/applications/${uuid}`);
  }

  async getApplicationLogs(uuid: string) {
    return this.get(`/applications/${uuid}/logs`);
  }

  async startApplication(uuid: string) {
    return this.get(`/applications/${uuid}/start`);
  }

  async stopApplication(uuid: string) {
    return this.get(`/applications/${uuid}/stop`);
  }

  async restartApplication(uuid: string) {
    return this.get(`/applications/${uuid}/restart`);
  }

  // Application Environment Variables
  async listApplicationEnvs(uuid: string) {
    return this.get(`/applications/${uuid}/envs`);
  }

  async createApplicationEnv(uuid: string, data: any) {
    return this.post(`/applications/${uuid}/envs`, data);
  }

  async updateApplicationEnv(uuid: string, envId: string, data: any) {
    return this.patch(`/applications/${uuid}/envs/${envId}`, data);
  }

  async deleteApplicationEnv(uuid: string, envId: string) {
    return this.delete(`/applications/${uuid}/envs/${envId}`);
  }

  // ============ DATABASES ============
  async listDatabases() {
    return this.get('/databases');
  }

  async getDatabase(uuid: string) {
    return this.get(`/databases/${uuid}`);
  }

  async createDatabase(data: any) {
    // Determine database type from image or explicit type field
    const image = data.image || '';
    const type = data.type || '';
    
    let endpoint = '/databases';
    
    if (type === 'postgresql' || image.includes('postgres')) {
      endpoint = '/databases/postgresql';
    } else if (type === 'mysql' || image.includes('mysql')) {
      endpoint = '/databases/mysql';
    } else if (type === 'mongodb' || image.includes('mongo')) {
      endpoint = '/databases/mongodb';
    } else if (type === 'redis' || image.includes('redis')) {
      endpoint = '/databases/redis';
    } else if (type === 'mariadb' || image.includes('mariadb')) {
      endpoint = '/databases/mariadb';
    } else if (type === 'clickhouse' || image.includes('clickhouse')) {
      endpoint = '/databases/clickhouse';
    } else if (type === 'dragonfly' || image.includes('dragonfly')) {
      endpoint = '/databases/dragonfly';
    } else if (type === 'keydb' || image.includes('keydb')) {
      endpoint = '/databases/keydb';
    }
    
    return this.post(endpoint, data);
  }

  async updateDatabase(uuid: string, data: any) {
    return this.patch(`/databases/${uuid}`, data);
  }

  async deleteDatabase(uuid: string) {
    return this.delete(`/databases/${uuid}`);
  }

  async startDatabase(uuid: string) {
    return this.get(`/databases/${uuid}/start`);
  }

  async stopDatabase(uuid: string) {
    return this.get(`/databases/${uuid}/stop`);
  }

  async restartDatabase(uuid: string) {
    return this.get(`/databases/${uuid}/restart`);
  }

  // ============ SERVICES ============
  async listServices() {
    return this.get('/services');
  }

  async getService(uuid: string) {
    return this.get(`/services/${uuid}`);
  }

  async createService(data: any) {
    return this.post('/services', data);
  }

  async updateService(uuid: string, data: any) {
    return this.patch(`/services/${uuid}`, data);
  }

  async deleteService(uuid: string) {
    return this.delete(`/services/${uuid}`);
  }

  async startService(uuid: string) {
    return this.get(`/services/${uuid}/start`);
  }

  async stopService(uuid: string) {
    return this.get(`/services/${uuid}/stop`);
  }

  async restartService(uuid: string) {
    return this.get(`/services/${uuid}/restart`);
  }

  // Service Environment Variables
  async listServiceEnvs(uuid: string) {
    return this.get(`/services/${uuid}/envs`);
  }

  async createServiceEnv(uuid: string, data: any) {
    return this.post(`/services/${uuid}/envs`, data);
  }

  async updateServiceEnv(uuid: string, envId: string, data: any) {
    return this.patch(`/services/${uuid}/envs/${envId}`, data);
  }

  async deleteServiceEnv(uuid: string, envId: string) {
    return this.delete(`/services/${uuid}/envs/${envId}`);
  }

  // ============ SERVERS ============
  async listServers() {
    return this.get('/servers');
  }

  async getServer(uuid: string) {
    return this.get(`/servers/${uuid}`);
  }

  async createServer(data: any) {
    return this.post('/servers', data);
  }

  async updateServer(uuid: string, data: any) {
    return this.patch(`/servers/${uuid}`, data);
  }

  async deleteServer(uuid: string) {
    return this.delete(`/servers/${uuid}`);
  }

  async getServerResources(uuid: string) {
    return this.get(`/servers/${uuid}/resources`);
  }

  async getServerDomains(uuid: string) {
    return this.get(`/servers/${uuid}/domains`);
  }

  async validateServer(uuid: string) {
    return this.get(`/servers/${uuid}/validate`);
  }

  // ============ PROJECTS ============
  async listProjects() {
    return this.get('/projects');
  }

  async getProject(uuid: string) {
    return this.get(`/projects/${uuid}`);
  }

  async createProject(data: any) {
    return this.post('/projects', data);
  }

  async updateProject(uuid: string, data: any) {
    return this.patch(`/projects/${uuid}`, data);
  }

  async deleteProject(uuid: string) {
    return this.delete(`/projects/${uuid}`);
  }

  async getProjectEnvironment(uuid: string) {
    return this.get(`/projects/${uuid}/environment`);
  }

  // ============ DEPLOYMENTS ============
  async listDeployments() {
    return this.get('/deployments');
  }

  async getDeployment(uuid: string) {
    return this.get(`/deployments/${uuid}`);
  }

  async deployApplication(uuid: string) {
    return this.get(`/deployments/${uuid}/deploy`);
  }

  async listApplicationDeployments(uuid: string) {
    return this.get(`/applications/${uuid}/deployments`);
  }

  // ============ TEAMS ============
  async listTeams() {
    return this.get('/teams');
  }

  async getTeam(uuid: string) {
    return this.get(`/teams/${uuid}`);
  }

  async getTeamMembers(uuid: string) {
    return this.get(`/teams/${uuid}/members`);
  }

  async getAuthenticatedTeam() {
    return this.get('/teams/authenticated');
  }

  async getAuthenticatedTeamMembers() {
    return this.get('/teams/authenticated/members');
  }

  // ============ PRIVATE KEYS ============
  async listPrivateKeys() {
    return this.get('/private-keys');
  }

  async getPrivateKey(uuid: string) {
    return this.get(`/private-keys/${uuid}`);
  }

  async createPrivateKey(data: any) {
    return this.post('/private-keys', data);
  }

  async updatePrivateKey(uuid: string, data: any) {
    return this.patch(`/private-keys/${uuid}`, data);
  }

  async deletePrivateKey(uuid: string) {
    return this.delete(`/private-keys/${uuid}`);
  }

  // ============ GENERAL ============
  async getVersion() {
    return this.get('/version');
  }

  async healthCheck() {
    // Use teams endpoint as a health check since Coolify doesn't have a dedicated healthcheck endpoint
    return this.get('/teams');
  }

  async listResources() {
    return this.get('/resources');
  }
}