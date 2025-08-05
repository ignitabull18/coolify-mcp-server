# 🎯 **MCPHub + Coolify MCP Server - Quick Reference**

## 🚀 **30-Second Setup**

1. **Deploy Coolify MCP Server** on your Coolify instance:
   - Repository: This repo
   - Start command: `npm run start:http`
   - Environment: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`

2. **Add to MCPHub** (`mcp_settings.json`):
   ```json
   {
     "mcpServers": {
       "coolify": {
         "url": "https://your-deployed-server.com/mcp",
         "enabled": true,
         "group": "infrastructure"
       }
     }
   }
   ```

3. **Connect clients** to: `http://your-mcphub:3000/mcp`

## 📋 **Available Endpoints**

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `/mcp` | All servers | `http://mcphub:3000/mcp` |
| `/mcp/infrastructure` | Infrastructure group | `http://mcphub:3000/mcp/infrastructure` |
| `/mcp/coolify` | Only Coolify server | `http://mcphub:3000/mcp/coolify` |
| `/mcp/$smart` | Smart routing | `http://mcphub:3000/mcp/$smart` |

## 🛠️ **Key Coolify Tools**

```bash
# Applications
coolify__listApplications
coolify__createApplication
coolify__deployApplication
coolify__startApplication
coolify__stopApplication

# Databases  
coolify__listDatabases
coolify__createDatabase
coolify__startDatabase
coolify__stopDatabase

# Services
coolify__listServices
coolify__createService
coolify__restartService

# Infrastructure
coolify__listServers
coolify__createServer
coolify__validateServer
```

## 📊 **Resources**

```bash
# Direct access to Coolify data
coolify://applications/{uuid}
coolify://databases/{uuid}
coolify://services/{uuid}
coolify://overview
coolify://status
```

## 💡 **Workflow Prompts**

```bash
# Common operations
deploy-application
troubleshoot-deployment
setup-new-project
database-setup
setup-monitoring
performance-optimization
```

## 🔧 **Client Configurations**

### **Claude Desktop**:
```json
{
  "mcpServers": {
    "mcphub": {
      "url": "http://your-mcphub:3000/mcp"
    }
  }
}
```

### **Cursor/VS Code**:
```json
{
  "mcp.servers": {
    "mcphub": {
      "transport": "sse", 
      "url": "http://your-mcphub:3000/mcp"
    }
  }
}
```

## 🎮 **MCPHub Dashboard**

- **URL**: `http://your-mcphub:3000`
- **Default Login**: `admin` / `admin123`
- **Servers**: View and manage all MCP servers
- **Groups**: Organize servers by function
- **Users**: Manage access and permissions
- **Monitoring**: Real-time server status and logs

## 🔍 **Health Checks**

```bash
# MCPHub health
curl http://your-mcphub:3000/api/health

# Coolify MCP server health  
curl https://your-coolify-mcp.com/health

# Test integration
curl -X POST http://your-mcphub:3000/api/servers/tools \
  -H "Content-Type: application/json" \
  -d '{"server_name": "coolify", "tool": "listApplications", "arguments": {}}'
```

## 📈 **Scaling Tips**

- **Environment Groups**: Create separate groups for dev/staging/prod
- **Smart Routing**: Enable vector search for automatic tool discovery
- **Access Control**: Use MCPHub's role-based permissions
- **Monitoring**: Set up alerts for server health and performance
- **Load Balancing**: Deploy multiple Coolify MCP servers if needed

## 🎯 **Next Steps**

1. ✅ Deploy and configure
2. 🔗 Connect your AI clients  
3. 🎪 Try natural language DevOps commands
4. 📊 Monitor through the dashboard
5. 🚀 Explore advanced workflows and automation

**Your Coolify infrastructure is now conversational!** 🎉