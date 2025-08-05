# 🚀 Deployment Guide for Coolify MCP Server

This guide covers multiple deployment options for hosting your Coolify MCP Server remotely.

## 📋 Prerequisites

1. **Environment Variables**: Set up your `.env` file with:
   ```env
   COOLIFY_BASE_URL=https://your-coolify-instance.com/api/v1
   COOLIFY_API_TOKEN=your_api_token_here
   PORT=3000
   HOST=0.0.0.0
   ```

2. **Dependencies**: Install Express for HTTP transport:
   ```bash
   npm install express @types/express
   ```

## 🔥 Option 1: Deploy on Coolify (Recommended)

The most elegant solution - deploy your Coolify MCP Server **on Coolify itself**!

### Setup Steps:

1. **Create New Application** in your Coolify dashboard
2. **Connect Repository**: Link to your MCP server repository
3. **Configure Build Settings**:
   ```dockerfile
   # Build Command
   npm ci && npm run build
   
   # Start Command  
   npm run start:http
   
   # Port
   3000
   ```

4. **Set Environment Variables** in Coolify:
   - `COOLIFY_BASE_URL`: Your Coolify API URL
   - `COOLIFY_API_TOKEN`: Your API token
   - `PORT`: 3000
   - `HOST`: 0.0.0.0

5. **Deploy**: Coolify will build and deploy automatically

6. **Configure Domain**: Set up your custom domain or use Coolify's provided URL

### Benefits:
- ✅ Self-hosting on your own Coolify instance
- ✅ Automatic deployments and updates
- ✅ Built-in SSL certificates
- ✅ Monitoring and logs
- ✅ Zero-downtime deployments

## 🐳 Option 2: Docker Deployment

### Using Docker Compose:

1. **Clone and Build**:
   ```bash
   git clone <your-repo>
   cd coolify-mcp-server
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Deploy**:
   ```bash
   docker-compose up -d
   ```

3. **Access**: Your server will be available at `http://localhost:3000`

### Using Docker directly:

```bash
# Build the image
docker build -t coolify-mcp-server .

# Run the container
docker run -d \
  --name coolify-mcp-server \
  -p 3000:3000 \
  -e COOLIFY_BASE_URL=https://your-coolify.com/api/v1 \
  -e COOLIFY_API_TOKEN=your_token \
  coolify-mcp-server
```

## ☁️ Option 3: Cloud Platforms

### Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --env COOLIFY_BASE_URL=your_url --env COOLIFY_API_TOKEN=your_token
```

### Railway:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway add COOLIFY_BASE_URL=your_url
railway add COOLIFY_API_TOKEN=your_token
railway up
```

### Render:
1. Connect your GitHub repository
2. Set build command: `npm ci && npm run build`
3. Set start command: `npm run start:http`
4. Add environment variables
5. Deploy

## 🖥️ Option 4: VPS Deployment

### Using PM2 (Process Manager):

1. **Setup Server**:
   ```bash
   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Deploy Application**:
   ```bash
   # Clone and setup
   git clone <your-repo>
   cd coolify-mcp-server
   npm ci
   npm run build
   
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'coolify-mcp-server',
       script: 'build/server-http.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
         HOST: '0.0.0.0',
         COOLIFY_BASE_URL: 'https://your-coolify.com/api/v1',
         COOLIFY_API_TOKEN: 'your_token'
       }
     }]
   }
   EOF
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx Reverse Proxy**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Client Configuration

### For Remote HTTP Server:

Instead of local command execution, clients connect via HTTP:

**Claude Desktop Configuration**:
```json
{
  "mcpServers": {
    "coolify": {
      "url": "https://your-mcp-server.com/mcp",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Cursor/VS Code Configuration**:
```json
{
  "mcp.servers": {
    "coolify": {
      "transport": "sse",
      "url": "https://your-mcp-server.com/mcp"
    }
  }
}
```

## 📊 Monitoring and Health Checks

Your deployed server provides several endpoints:

- **Health Check**: `GET /health` - Service status
- **Info**: `GET /info` - Server information and capabilities  
- **MCP Endpoint**: `GET /mcp` - Server-Sent Events for MCP communication

### Example Health Check Response:
```json
{
  "status": "healthy",
  "service": "coolify-mcp-server", 
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit API tokens to version control
2. **HTTPS**: Always use HTTPS in production (Coolify provides this automatically)
3. **Firewall**: Restrict access to your server's port if needed
4. **API Token Rotation**: Regularly rotate your Coolify API tokens
5. **CORS**: The server includes CORS headers for cross-origin requests

## 🎯 Registry Options

While **not required** for remote hosting, you may want to publish to registries for discovery:

### Docker Hub:
```bash
docker build -t your-username/coolify-mcp-server .
docker push your-username/coolify-mcp-server
```

### npm Registry:
```bash
npm publish
```

### GitHub Container Registry:
```bash
docker build -t ghcr.io/your-username/coolify-mcp-server .
docker push ghcr.io/your-username/coolify-mcp-server
```

## 🚦 Testing Your Deployment

1. **Health Check**:
   ```bash
   curl https://your-server.com/health
   ```

2. **MCP Connection**:
   ```bash
   curl -H "Accept: text/event-stream" https://your-server.com/mcp
   ```

3. **Load Testing**:
   ```bash
   # Install hey
   go install github.com/rakyll/hey@latest
   
   # Test 1000 requests with 50 concurrent connections
   hey -n 1000 -c 50 https://your-server.com/health
   ```

## 🎉 Benefits of Remote Hosting

- **Multi-Client Access**: Share one server across multiple AI clients
- **Centralized Management**: Single point for updates and monitoring
- **Scalability**: Handle multiple concurrent MCP sessions
- **Reliability**: Professional hosting with uptime guarantees
- **Team Collaboration**: Multiple team members can use the same MCP server

Choose the deployment option that best fits your infrastructure and requirements!