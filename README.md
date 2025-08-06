# Coolify MCP Server 🚀

A comprehensive Model Context Protocol (MCP) server that provides complete access to the Coolify API. This server enables AI assistants to manage applications, databases, services, servers, and more through Coolify's platform.

## Features ✨

### 🛠️ **90+ API Tools**
Complete coverage of all Coolify endpoints with type-specific routing:
- **Applications**: Create, deploy, update, start/stop/restart, environment variables, logs
- **Databases**: PostgreSQL, MySQL, MariaDB, MongoDB, Redis, DragonFly, KeyDB, ClickHouse
- **Services**: One-click services, custom deployments, lifecycle management
- **Servers**: Validation, resource monitoring, domain management
- **Projects**: Organization, environments, team collaboration
- **Deployments**: Monitoring, history, automated deployments
- **Teams & Access**: User management, private keys, permissions

### 📊 **10+ Resources**
Access Coolify data through standardized URIs:
- `coolify://applications/{uuid}` - Application details
- `coolify://databases/{uuid}` - Database information  
- `coolify://services/{uuid}` - Service configurations
- `coolify://servers/{uuid}` - Server details
- `coolify://projects/{uuid}` - Project information
- `coolify://overview` - Complete instance overview
- `coolify://status` - Health and status information

### 💡 **8+ Workflow Prompts**
Guided workflows for common DevOps tasks:
- **deploy-application** - Complete deployment workflow
- **troubleshoot-deployment** - Diagnostic and problem solving
- **setup-new-project** - Project setup guidance  
- **database-setup** - Database configuration and best practices
- **setup-monitoring** - Monitoring and alerting setup
- **maintenance-workflow** - Safe maintenance procedures
- **performance-optimization** - Performance analysis and tuning
- **disaster-recovery-plan** - DR planning and procedures

## Installation 📦

1. **Clone the repository:**
```bash
git clone <repository-url>
cd coolify-mcp-server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Coolify details:
```env
COOLIFY_BASE_URL=https://app.coolify.io/api/v1
COOLIFY_API_TOKEN=your_api_token_here
```

For self-hosted Coolify instances:
```env
COOLIFY_BASE_URL=https://your-coolify-instance.com/api/v1
COOLIFY_API_TOKEN=your_api_token_here
```

4. **Build the server:**
```bash
npm run build
```

## Usage 🎯

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Testing with MCP Inspector
```bash
npm run inspector
```

### Remote HTTP Server (NEW!)
For hosting the MCP server remotely and connecting multiple clients:

```bash
# Install additional dependencies
npm install express @types/express

# Build and start HTTP server
npm run build
npm run start:http  # Starts on http://localhost:3000
```

Access endpoints:
- **Health**: `http://localhost:3000/health`
- **Info**: `http://localhost:3000/info`  
- **MCP**: `http://localhost:3000/mcp` (Server-Sent Events)

See `DEPLOYMENT.md` for comprehensive remote hosting options including:
- 🔥 Deploy on **Coolify** (recommended)
- 🎯 **MCPHub Integration** (see `MCPHUB_INSTALLATION.md`)
- 🐳 **Docker** deployment
- ☁️ **Cloud platforms** (Vercel, Railway, Render)
- 🖥️ **VPS** hosting with PM2

## Getting Your API Token 🔑

1. Log into your Coolify instance
2. Go to **Security** → **API Tokens**
3. Click **Generate API Token**
4. Copy the token and add it to your `.env` file

## MCP Client Configuration 📱

### Local Execution (Traditional)

**Claude Desktop** - Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "coolify": {
      "command": "node",
      "args": ["/path/to/coolify-mcp-server/build/index.js"]
    }
  }
}
```

**VS Code** - Add to your VS Code MCP settings:
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

### Remote HTTP Connection (NEW!)

**Claude Desktop** - Connect to remotely hosted server:
```json
{
  "mcpServers": {
    "coolify-remote": {
      "url": "https://your-mcp-server.com/mcp"
    }
  }
}
```

**Development/Local HTTP**:
```json
{
  "mcpServers": {
    "coolify-local": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

**Multiple Environments**:
```json
{
  "mcpServers": {
    "coolify-staging": {
      "url": "https://staging-mcp.yourcompany.com/mcp"
    },
    "coolify-production": {
      "url": "https://production-mcp.yourcompany.com/mcp"
    }
  }
}
```

### MCPHub Integration (Recommended for Teams)

If you're using **samanhappy/mcphub** for centralized MCP server management:

**Add to your `mcp_settings.json`**:
```json
{
  "mcpServers": {
    "coolify": {
      "url": "https://your-coolify-mcp.com/mcp",
      "description": "Complete Coolify API integration",
      "enabled": true,
      "group": "infrastructure"
    }
  }
}
```

**Benefits of MCPHub Integration**:
- 🎪 **Web Dashboard** - Manage servers through UI
- 👥 **Team Access** - Role-based permissions and user management  
- 🏷️ **Server Groups** - Organize by environment or function
- 🔀 **Smart Routing** - AI-powered tool discovery
- 📊 **Monitoring** - Real-time server health and usage analytics
- 🔄 **Hot Reloading** - Update configurations without restarts

**Client connects to MCPHub instead**:
```json
{
  "mcpServers": {
    "mcphub": {
      "url": "http://your-mcphub:3000/mcp"
    }
  }
}
```

See `MCPHUB_INSTALLATION.md` for complete setup instructions.

## API Coverage 📋

This MCP server provides complete coverage of the Coolify API:

### Applications
- ✅ List applications
- ✅ Get application details
- ✅ Create new applications
- ✅ Update applications  
- ✅ Delete applications
- ✅ Start/Stop/Restart applications
- ✅ Deploy applications
- ✅ Get application logs
- ✅ Manage environment variables

### Databases  
- ✅ Support for all database types
- ✅ Create, read, update, delete operations
- ✅ Start/Stop/Restart database instances
- ✅ Configuration management

### Services
- ✅ One-click service deployment
- ✅ Custom service configuration
- ✅ Service lifecycle management
- ✅ Environment variable management

### Servers
- ✅ Server validation and health checks
- ✅ Resource monitoring
- ✅ Domain management
- ✅ SSH key management

### Projects & Teams
- ✅ Project organization
- ✅ Team collaboration features
- ✅ Access control and permissions

## Example Usage 💻

### Deploy a New Application
```javascript
// Using the deploy-application prompt
const deployment = await mcpClient.callPrompt('deploy-application', {
  application_name: 'my-awesome-app',
  environment: 'production'
});
```

### Monitor System Health
```javascript
// Access the overview resource
const overview = await mcpClient.readResource('coolify://overview');
console.log(JSON.parse(overview.content[0].text));
```

### Create a Database
```javascript
// Use the create-database tool
const database = await mcpClient.callTool('create-database', {
  name: 'my-app-db',
  type: 'postgresql',
  project_uuid: 'project-uuid',
  server_uuid: 'server-uuid'
});
```

## Architecture 🏗️

```
├── src/
│   ├── index.ts           # Main server entry point
│   ├── api-client.ts      # Coolify API client
│   ├── types.ts           # TypeScript definitions
│   ├── tools.ts           # MCP tools (API operations)
│   ├── resources.ts       # MCP resources (data access)
│   └── prompts.ts         # MCP prompts (workflows)
├── build/                 # Compiled JavaScript
└── package.json          # Dependencies and scripts
```

## Error Handling 🛡️

The server includes comprehensive error handling:
- API connection validation on startup
- Graceful error responses for failed operations
- Detailed error messages with context
- Automatic retry for transient failures

## Security Considerations 🔒

- API tokens are loaded from environment variables
- All API requests use bearer token authentication
- No sensitive data is logged or exposed
- Secure HTTPS communication with Coolify API

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting 🔧

### Common Issues

**Connection Errors:**
- Verify your `COOLIFY_BASE_URL` is correct
- Check that your `COOLIFY_API_TOKEN` is valid
- Ensure your Coolify instance is accessible

**Tool Execution Errors:**
- Check the MCP client logs for detailed error messages
- Verify required parameters are provided
- Ensure you have proper permissions in Coolify

### Debug Mode
Set `NODE_ENV=development` for verbose logging.

## License 📄

MIT License - see LICENSE file for details.

## Support 💬

- Check the [Coolify Documentation](https://coolify.io/docs)
- Review [MCP Protocol Specification](https://modelcontextprotocol.io/docs)
- Open an issue for bugs or feature requests

---

**Built with ❤️ for the Coolify and MCP communities**# Trigger deployment Wed Aug  6 16:36:06 PDT 2025
