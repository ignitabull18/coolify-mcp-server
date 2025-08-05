# 🚀 Deploy Coolify MCP Server to Your Coolify Instance

## Quick Deployment Steps

### 1. Create New Application in Coolify

1. **Go to your Coolify dashboard**
2. **Create New Resource** → **Application**
3. **Connect Repository**: Link this repository
4. **Configure Build Settings**:
   ```dockerfile
   # Build Command
   npm ci && npm run build
   
   # Start Command  
   npm run start:http
   
   # Port
   3000
   ```

### 2. Set Environment Variables

In your Coolify application settings, add:

```env
# Required - Your Coolify API credentials
COOLIFY_BASE_URL=https://your-coolify-instance.com/api/v1
COOLIFY_API_TOKEN=your_coolify_api_token_here

# HTTP Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

### 3. Deploy

Click **Deploy** - Coolify will:
- ✅ Build the TypeScript code
- ✅ Start the HTTP server
- ✅ Provide you with a URL (e.g., `https://coolify-mcp.your-domain.com`)

### 4. Test Your Deployment

```bash
# Health check
curl https://coolify-mcp.your-domain.com/health

# Server info
curl https://coolify-mcp.your-domain.com/info
```

### 5. Get Your MCP Endpoint

Your MCP server will be available at:
```
https://coolify-mcp.your-domain.com/mcp
```

**Save this URL** - you'll need it for MCPHub configuration!

## 🔒 Security Notes

- The server uses your Coolify API token to access your instance
- Deploy on your own Coolify instance for maximum security
- Consider using environment-specific tokens (staging vs production)

## 📊 Monitoring

Your deployed server provides:
- **Health Endpoint**: `/health` - Service status
- **Info Endpoint**: `/info` - Server capabilities
- **MCP Endpoint**: `/mcp` - The actual MCP interface
- **Logs**: Available in Coolify dashboard

## 🔄 Updates

To update your server:
1. Push changes to your repository
2. Coolify auto-deploys (if enabled)
3. Or manually trigger deployment in Coolify dashboard

Your MCP server is now ready to be added to your MCPHub! 🎉