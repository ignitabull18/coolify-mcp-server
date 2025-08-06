# COMPLETE COOLIFY API ENDPOINTS REFERENCE

Based on official Coolify API documentation at coolify.io/docs/api-reference

## APPLICATIONS

### List & Get Operations (✅ Working)
- `GET /applications` - List all applications  
- `GET /applications/{uuid}` - Get specific application

### Create Operations (❌ WRONG ENDPOINTS)
Current: `POST /applications` ❌
Correct endpoints:
- `POST /applications/public` - Create public repository app
- `POST /applications/github-app` - Create private app with GitHub App
- `POST /applications/deploy-key` - Create private app with deploy key  
- `POST /applications/dockerfile` - Create Dockerfile-based app
- `POST /applications/docker-image` - Create Docker image app
- `POST /applications/docker-compose` - Create Docker Compose app

### Management Operations (✅ Correct)
- `DELETE /applications/{uuid}` - Delete application
- `PATCH /applications/{uuid}` - Update application
- `GET /applications/{uuid}/logs` - Get application logs
- `GET /applications/{uuid}/start` - Start application
- `GET /applications/{uuid}/stop` - Stop application  
- `GET /applications/{uuid}/restart` - Restart application

### Environment Variables (✅ Correct)
- `GET /applications/{uuid}/envs` - List environment variables
- `POST /applications/{uuid}/envs` - Create environment variable
- `PATCH /applications/{uuid}/envs/{envId}` - Update environment variable
- `DELETE /applications/{uuid}/envs/{envId}` - Delete environment variable

## DATABASES

### List & Get Operations (✅ Working)
- `GET /databases` - List all databases
- `GET /databases/{uuid}` - Get specific database

### Create Operations (✅ FIXED - Type-specific endpoints)
- `POST /databases/postgresql` - Create PostgreSQL database
- `POST /databases/mysql` - Create MySQL database  
- `POST /databases/mongodb` - Create MongoDB database
- `POST /databases/redis` - Create Redis database
- `POST /databases/mariadb` - Create MariaDB database
- `POST /databases/clickhouse` - Create ClickHouse database
- `POST /databases/dragonfly` - Create DragonFly database
- `POST /databases/keydb` - Create KeyDB database

### Management Operations (✅ Correct)
- `DELETE /databases/{uuid}` - Delete database
- `PATCH /databases/{uuid}` - Update database
- `GET /databases/{uuid}/start` - Start database
- `GET /databases/{uuid}/stop` - Stop database
- `GET /databases/{uuid}/restart` - Restart database

## SERVICES

### List & Get Operations (✅ Working)
- `GET /services` - List all services
- `GET /services/{uuid}` - Get specific service

### Create Operations (❌ WRONG ENDPOINT)
Current: `POST /services` ❌
Correct: `POST /services/service` - Create service

### Management Operations (✅ Correct)
- `DELETE /services/{uuid}` - Delete service
- `PATCH /services/{uuid}` - Update service
- `GET /services/{uuid}/start` - Start service
- `GET /services/{uuid}/stop` - Stop service
- `GET /services/{uuid}/restart` - Restart service

### Environment Variables (✅ Correct)
- `GET /services/{uuid}/envs` - List environment variables
- `POST /services/{uuid}/envs` - Create environment variable
- `PATCH /services/{uuid}/envs/{envId}` - Update environment variable
- `DELETE /services/{uuid}/envs/{envId}` - Delete environment variable

## PROJECTS (✅ All Correct)
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/{uuid}` - Get project
- `DELETE /projects/{uuid}` - Delete project
- `PATCH /projects/{uuid}` - Update project
- `GET /projects/{uuid}/environment` - Get project environment

## SERVERS (✅ All Correct)
- `GET /servers` - List servers
- `POST /servers` - Create server
- `GET /servers/{uuid}` - Get server
- `DELETE /servers/{uuid}` - Delete server
- `PATCH /servers/{uuid}` - Update server
- `GET /servers/{uuid}/resources` - Get server resources
- `GET /servers/{uuid}/domains` - Get server domains
- `GET /servers/{uuid}/validate` - Validate server

## DEPLOYMENTS (✅ All Correct)
- `GET /deployments` - List deployments
- `GET /deployments/{uuid}` - Get deployment
- `GET /applications/{uuid}/deploy` - Deploy application
- `GET /applications/{uuid}/deployments` - List application deployments

## TEAMS (✅ All Correct)
- `GET /teams` - List teams
- `GET /teams/{uuid}` - Get team
- `GET /teams/{uuid}/members` - Get team members

## PRIVATE KEYS (✅ All Correct)
- `GET /security/keys` - List private keys
- `POST /security/keys` - Create private key
- `PATCH /security/keys` - Update private key
- `GET /security/keys/{uuid}` - Get private key
- `DELETE /security/keys/{uuid}` - Delete private key

## DEFAULT/SYSTEM (✅ All Correct)
- `GET /version` - Get version
- `GET /api/enable` - Enable API
- `GET /api/disable` - Disable API
- `GET /healthcheck` - Health check

## RESOURCES (✅ Correct)
- `GET /resources` - List all resources

---

## SUMMARY OF ISSUES FOUND:

### ❌ WRONG ENDPOINTS:
1. **Applications Create**: Using `POST /applications` instead of type-specific endpoints
2. **Services Create**: Using `POST /services` instead of `POST /services/service`

### ✅ CORRECT ENDPOINTS:
- All database create operations (already fixed)
- All management operations (start/stop/restart/delete/update)
- All list/get operations
- All environment variable operations  
- Projects, servers, deployments, teams, private keys

## REQUIRED FIXES:
1. Update `createApplication()` to use correct type-specific endpoints
2. Update `createService()` to use `/services/service` endpoint
3. All other endpoints are already correct!
