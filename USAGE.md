# Coolify MCP Server Usage Guide 🎯

This guide demonstrates how to use the Coolify MCP Server in various scenarios.

## Quick Start 🚀

### 1. Set up your environment
```bash
# Copy environment template
cp .env.example .env

# Edit with your Coolify details
nano .env
```

Add your Coolify configuration:
```env
COOLIFY_BASE_URL=https://app.coolify.io/api/v1
COOLIFY_API_TOKEN=your_api_token_here
```

### 2. Build and run
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### 3. Test with MCP Inspector
```bash
# Open MCP Inspector for testing
npm run inspector
```

## Common Use Cases 💡

### 1. Application Management

**Deploy a new application:**
```bash
# Use the deploy-application prompt for guided deployment
# This will walk you through the entire process
```

**Check application status:**
```bash
# Use list-applications tool to see all apps
# Use get-application tool with UUID for specific app details
```

**Manage environment variables:**
```bash
# Use list-application-envs to see current variables
# Use create-application-env to add new variables
# Use update-application-env to modify existing ones
```

### 2. Database Operations

**Create a new database:**
```bash
# Use create-database tool with required parameters:
# - name: Database name
# - type: postgresql, mysql, mongodb, redis, etc.
# - project_uuid: Target project
# - server_uuid: Target server
```

**Database maintenance:**
```bash
# Use start-database, stop-database, restart-database tools
# Use the database-setup prompt for configuration guidance
```

### 3. Server Management

**Monitor server health:**
```bash
# Use validate-server tool to check server status
# Use get-server-resources to see what's running
# Use coolify://status resource for overall health
```

**Add new server:**
```bash
# Use create-server tool with server details
# Use setup-new-project prompt for complete setup guidance
```

### 4. Deployment Monitoring

**Track deployments:**
```bash
# Use list-deployments to see current deployments
# Use get-deployment for specific deployment details
# Use list-application-deployments for app history
```

**Troubleshoot issues:**
```bash
# Use troubleshoot-deployment prompt for guided diagnosis
# Use get-application-logs to check application logs
```

## Resources Overview 📊

### Application Resources
- `coolify://applications/{uuid}` - Specific application details
- `coolify://applications` - List all applications

### Database Resources  
- `coolify://databases/{uuid}` - Specific database details
- `coolify://databases` - List all databases

### Service Resources
- `coolify://services/{uuid}` - Specific service details
- `coolify://services` - List all services

### Server Resources
- `coolify://servers/{uuid}` - Specific server details
- `coolify://servers` - List all servers

### Project Resources
- `coolify://projects/{uuid}` - Specific project details
- `coolify://projects` - List all projects

### System Resources
- `coolify://overview` - Complete system overview
- `coolify://status` - Health and status information

## Workflow Prompts 🛠️

### 1. deploy-application
Complete deployment workflow with best practices
```
Parameters:
- application_name: Name of your application
- environment: production/staging/development
```

### 2. troubleshoot-deployment
Diagnostic help for deployment issues
```
Parameters:
- application_uuid: UUID of problematic application
- issue_description: Description of the problem
```

### 3. setup-new-project
Guide for setting up new projects
```
Parameters:
- project_name: Name for the new project
- project_type: web-app/api/microservice/full-stack
- environment_count: Number of environments needed
```

### 4. database-setup
Database configuration and best practices
```
Parameters:
- database_type: postgresql/mysql/mongodb/redis/etc.
- purpose: What the database will be used for
- environment: target environment
```

### 5. setup-monitoring
Monitoring and alerting configuration
```
Parameters:
- resource_type: application/database/service/server/all
- alert_level: basic/advanced/enterprise
```

### 6. maintenance-workflow
Safe maintenance procedures
```
Parameters:
- maintenance_type: security-updates/application-updates/etc.
- urgency: routine/urgent/emergency
```

### 7. performance-optimization
Performance analysis and tuning
```
Parameters:
- focus_area: application/database/infrastructure/network/storage
- current_issues: (optional) Current performance problems
```

### 8. disaster-recovery-plan
Disaster recovery planning
```
Parameters:
- recovery_scope: application/database/full-infrastructure
- rto_requirement: Recovery Time Objective in hours
- rpo_requirement: Recovery Point Objective in hours
```

## Integration Examples 🔌

### With Claude Desktop

1. Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": ["/path/to/coolify-mcp-server/build/index.js"],
      "env": {
        "COOLIFY_BASE_URL": "https://app.coolify.io/api/v1",
        "COOLIFY_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

2. Chat examples:
```
"Show me all my applications in Coolify"
"Deploy my React app to production"
"Create a PostgreSQL database for my project"
"Help me troubleshoot deployment issues"
"Set up monitoring for my application"
```

### With VS Code

1. Install MCP extension
2. Add to settings:
```json
{
  "mcp": {
    "servers": {
      "coolify": {
        "command": "node",
        "args": ["/path/to/coolify-mcp-server/build/index.js"]
      }
    }
  }
}
```

## API Coverage ✅

### Complete Coolify API Support

**Applications (12 tools):**
- ✅ CRUD operations
- ✅ Deployment management
- ✅ Environment variables
- ✅ Logs and monitoring
- ✅ Start/stop/restart operations

**Databases (8 tools):**
- ✅ All database types supported
- ✅ CRUD operations
- ✅ Start/stop/restart operations
- ✅ Configuration management

**Services (8 tools):**
- ✅ One-click services
- ✅ Custom services
- ✅ Environment variables
- ✅ Lifecycle management

**Servers (7 tools):**
- ✅ Server validation
- ✅ Resource monitoring
- ✅ Domain management
- ✅ CRUD operations

**Projects (5 tools):**
- ✅ Project organization
- ✅ Environment management
- ✅ CRUD operations

**Deployments (4 tools):**
- ✅ Deployment monitoring
- ✅ History tracking
- ✅ Status management

**System (3 tools):**
- ✅ Health checks
- ✅ Version information
- ✅ Resource overview

## Best Practices 🎯

### 1. Environment Variables
- Always use environment variables for sensitive data
- Don't commit `.env` files to version control
- Use different API tokens for different environments

### 2. Error Handling
- The server includes comprehensive error handling
- Check logs for detailed error information
- Use the troubleshoot-deployment prompt for guided diagnosis

### 3. Resource Management
- Monitor resource usage regularly
- Use the performance-optimization prompt for tuning
- Set up proper monitoring and alerting

### 4. Security
- Rotate API tokens regularly
- Use proper access controls in Coolify
- Keep your server updated

### 5. Monitoring
- Use the setup-monitoring prompt for comprehensive monitoring
- Set up alerts for critical resources
- Regular health checks with coolify://status resource

## Troubleshooting 🔧

### Common Issues

**Connection Problems:**
```bash
# Check your configuration
echo $COOLIFY_BASE_URL
echo $COOLIFY_API_TOKEN

# Test connectivity
curl -H "Authorization: Bearer $COOLIFY_API_TOKEN" $COOLIFY_BASE_URL/version
```

**Build Issues:**
```bash
# Clean and rebuild
rm -rf build/
npm run build
```

**Runtime Errors:**
```bash
# Check logs
npm start 2>&1 | tee coolify-mcp.log
```

### Debug Mode
Set `NODE_ENV=development` for verbose logging:
```bash
NODE_ENV=development npm start
```

## Support 💬

- [Coolify Documentation](https://coolify.io/docs)
- [MCP Protocol Docs](https://modelcontextprotocol.io/docs)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**Happy deploying with Coolify MCP Server! 🚀**