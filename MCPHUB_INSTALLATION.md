# 🎯 **Complete MCPHub Integration Guide**

## Overview

This guide shows you how to add the **Coolify MCP Server** to your existing **samanhappy/mcphub** installation. You'll get access to all Coolify functionality through your MCP hub's web dashboard and HTTP endpoints.

## 🚀 **Quick Start (Recommended Method)**

### **Step 1: Deploy Coolify MCP Server**

1. **Create new application in your Coolify instance**:
   - Repository: Link this `coolify-mcp-server` repository
   - Build command: `npm ci && npm run build`
   - Start command: `npm run start:http`
   - Port: `3000`

2. **Set environment variables**:
   ```env
   COOLIFY_BASE_URL=https://your-coolify-instance.com/api/v1
   COOLIFY_API_TOKEN=your_coolify_api_token_here
   PORT=3000
   HOST=0.0.0.0
   NODE_ENV=production
   ```

3. **Deploy and get your URL** (e.g., `https://coolify-mcp.your-domain.com`)

### **Step 2: Add to MCPHub**

1. **Access your MCPHub web dashboard** (usually `http://your-mcphub:3000`)

2. **Login with your admin credentials**

3. **Go to Servers Management** → **Add New Server**

4. **Configure the server**:
   ```json
   {
     "name": "coolify",
     "url": "https://coolify-mcp.your-domain.com/mcp",
     "description": "Complete Coolify API integration",
     "group": "infrastructure",
     "enabled": true
   }
   ```

5. **Save and Enable** - The server will appear in your dashboard!

## 🔧 **Manual Configuration Method**

If you prefer editing configuration files directly:

### **Update your `mcp_settings.json`**:

```json
{
  "mcpServers": {
    "coolify": {
      "url": "https://coolify-mcp.your-domain.com/mcp",
      "description": "Complete Coolify API integration",
      "enabled": true,
      "group": "infrastructure",
      "tags": ["devops", "deployment", "infrastructure"]
    },
    // ... your existing servers
  },
  "users": [
    // ... your existing users
  ]
}
```

### **Restart MCPHub**:
```bash
# If using Docker
docker restart your-mcphub-container

# If running directly
pm2 restart mcphub  # or your process manager
```

## 🎪 **What You Get**

Once integrated, your MCPHub will provide access to:

### **🛠️ 50+ Tools** via `/mcp` endpoint:
- **Applications**: `coolify__listApplications`, `coolify__createApplication`, `coolify__deployApplication`
- **Databases**: `coolify__listDatabases`, `coolify__createDatabase`, `coolify__startDatabase`  
- **Services**: `coolify__listServices`, `coolify__createService`, `coolify__restartService`
- **Servers**: `coolify__listServers`, `coolify__createServer`, `coolify__validateServer`
- **Projects**: `coolify__listProjects`, `coolify__createProject`, `coolify__updateProject`
- **Deployments**: `coolify__listDeployments`, `coolify__deployApplication`

### **📊 10+ Resources** via MCPHub's resource system:
- `coolify://applications/{uuid}` - Application details
- `coolify://databases/{uuid}` - Database information  
- `coolify://services/{uuid}` - Service configurations
- `coolify://overview` - Complete instance overview

### **💡 8+ Workflow Prompts**:
- `deploy-application` - Complete deployment workflow
- `troubleshoot-deployment` - Diagnostic guidance
- `setup-new-project` - Project setup with best practices
- `database-setup` - Database configuration
- `setup-monitoring` - Monitoring and alerting
- `performance-optimization` - Performance tuning

## 🔗 **Client Configuration**

### **Claude Desktop**:
```json
{
  "mcpServers": {
    "mcphub": {
      "url": "http://your-mcphub-server:3000/mcp"
    }
  }
}
```

### **Access Specific Groups**:
```json
{
  "mcpServers": {
    "infrastructure": {
      "url": "http://your-mcphub-server:3000/mcp/infrastructure"
    }
  }
}
```

### **Access Only Coolify**:
```json
{
  "mcpServers": {
    "coolify-only": {
      "url": "http://your-mcphub-server:3000/mcp/coolify"
    }
  }
}
```

## 📈 **Advanced Features**

### **Smart Routing** (if enabled):
```
http://your-mcphub-server:3000/mcp/$smart
```
Uses vector semantic search to automatically find relevant Coolify tools.

### **Group Management**:
- Organize Coolify with other infrastructure tools
- Create environment-specific groups (dev, staging, prod)
- Apply group-based access controls

### **Dashboard Monitoring**:
- Real-time status of your Coolify MCP server
- Enable/disable on demand
- View tool execution logs
- Monitor connection health

## 🔍 **Verification Steps**

1. **Check MCPHub Dashboard**:
   - Server appears in the servers list
   - Status shows "Connected"
   - Tools are discovered and listed

2. **Test the Integration**:
   ```bash
   # Health check
   curl http://your-mcphub:3000/api/servers

   # Test a Coolify tool
   curl -X POST http://your-mcphub:3000/api/servers/tools \
     -H "Content-Type: application/json" \
     -d '{"server_name": "coolify", "tool": "listApplications", "arguments": {}}'
   ```

3. **Connect AI Client**:
   - Configure Claude Desktop or other MCP client
   - List tools - you should see `coolify__*` tools
   - Try executing a tool like `coolify__listApplications`

## 🛠️ **Troubleshooting**

### **Server Not Connecting**:
- Check that your Coolify MCP server is running and accessible
- Verify the URL in your configuration
- Check MCPHub logs for connection errors

### **Tools Not Appearing**:
- Ensure the server is enabled in MCPHub
- Check the MCPHub dashboard for server status
- Restart MCPHub if needed

### **API Errors**:
- Verify your `COOLIFY_API_TOKEN` is valid
- Check that `COOLIFY_BASE_URL` points to your Coolify instance
- Ensure your Coolify instance is accessible from the MCP server

## 🎉 **You're Done!**

Your Coolify MCP server is now fully integrated with your MCPHub! You can:

✅ **Manage all Coolify resources** through natural language  
✅ **Access via web dashboard** for monitoring and control  
✅ **Use with any MCP client** through standardized endpoints  
✅ **Organize with other tools** using groups and smart routing  
✅ **Scale and monitor** through MCPHub's enterprise features  

**Next Steps**: Connect your AI assistants to the MCPHub endpoint and start managing your Coolify infrastructure through conversation! 🚀