import { CoolifyAPIClient } from './api-client.js';

export function registerCoolifyPrompts(server: any, apiClient: CoolifyAPIClient) {
  
  // ============================================
  // DEPLOYMENT WORKFLOWS
  // ============================================
  
  server.registerPrompt(
    'deploy-application',
    {
      title: 'Complete Application Deployment Workflow',
      description: 'Guided workflow for deploying applications with best practices, pre-deployment checks, and post-deployment validation.',
      inputSchema: {
        type: 'object',
        properties: {
          application_name: {
            type: 'string',
            description: 'Name of the application to deploy'
          },
          environment: {
            type: 'string',
            enum: ['development', 'staging', 'production'],
            description: 'Target deployment environment',
            default: 'production'
          },
          deployment_strategy: {
            type: 'string',
            enum: ['standard', 'zero-downtime', 'blue-green'],
            description: 'Deployment strategy to use',
            default: 'standard'
          },
          run_tests: {
            type: 'boolean',
            description: 'Run automated tests before deployment',
            default: true
          },
          backup_database: {
            type: 'boolean',
            description: 'Create database backup before deployment',
            default: true
          }
        },
        required: ['application_name']
      }
    },
    async (args: any) => {
      const { application_name, environment = 'production', deployment_strategy = 'standard', run_tests = true, backup_database = true } = args;
      
      // Get current applications to validate
      const apps = await apiClient.listApplications();
      const targetApp = apps.data?.find((app: any) => 
        app.name?.toLowerCase().includes(application_name.toLowerCase()) ||
        app.uuid === application_name
      );

      return {
        content: [{
          type: 'text',
          text: `# 🚀 **Application Deployment Workflow**

## **Target Application**: ${application_name}
${targetApp ? `✅ **Found**: ${targetApp.name} (${targetApp.uuid})` : `❌ **Not Found** - Please verify the application name`}

## **Deployment Configuration**
- **Environment**: ${environment}
- **Strategy**: ${deployment_strategy}
- **Run Tests**: ${run_tests ? '✅ Yes' : '❌ No'}
- **Database Backup**: ${backup_database ? '✅ Yes' : '❌ No'}

## **Pre-Deployment Checklist** ✅

### 1. **Application Health Check**
\`\`\`
Use: get-application with uuid: ${targetApp?.uuid || 'APPLICATION_UUID'}
\`\`\`
- ✅ Application exists and is accessible
- ✅ Current status is healthy
- ✅ No ongoing deployments

### 2. **Environment Validation**
\`\`\`
Use: list-application-envs with uuid: ${targetApp?.uuid || 'APPLICATION_UUID'}
\`\`\`
- ✅ All required environment variables are set
- ✅ Secrets are properly configured
- ✅ Database connections are valid

${backup_database ? `### 3. **Database Backup**
\`\`\`
Use: list-databases to identify connected databases
Then use: create-database-backup for each database
\`\`\`
- ✅ Backup all connected databases
- ✅ Verify backup integrity
- ✅ Document backup locations` : ''}

${run_tests ? `### 4. **Pre-Deployment Testing**
\`\`\`
# Run your test suite
npm test  # or your test command
\`\`\`
- ✅ All unit tests pass
- ✅ Integration tests pass
- ✅ Security scans complete` : ''}

## **Deployment Steps** 🎯

### 1. **Initiate Deployment**
\`\`\`
Use: deploy-application with uuid: ${targetApp?.uuid || 'APPLICATION_UUID'}
\`\`\`

### 2. **Monitor Progress**
\`\`\`
Use: get-application-logs with uuid: ${targetApp?.uuid || 'APPLICATION_UUID'}
\`\`\`
- Watch for build completion
- Monitor for any errors
- Verify container startup

### 3. **Post-Deployment Validation**
\`\`\`
Use: get-application with uuid: ${targetApp?.uuid || 'APPLICATION_UUID'}
\`\`\`
- ✅ Application is running
- ✅ Health checks pass
- ✅ Endpoints respond correctly

## **Rollback Plan** 🔄

If deployment fails:
1. **Stop current deployment**: \`stop-application\`
2. **Check logs**: \`get-application-logs\`
3. **Restart previous version**: \`restart-application\`
4. **Restore database** (if backup was created)

## **Success Criteria** ✨

- [ ] Application deploys without errors
- [ ] All health checks pass
- [ ] Response times are acceptable
- [ ] No increase in error rates
- [ ] Database connections stable

## **Next Steps**
1. Execute pre-deployment checklist
2. Run deployment command
3. Monitor and validate
4. Document any issues or improvements

**Need help?** Use the \`troubleshoot-deployment\` prompt if you encounter issues.`
        }]
      };
    }
  );

  // ============================================
  // TROUBLESHOOTING WORKFLOWS
  // ============================================
  
  server.registerPrompt(
    'troubleshoot-deployment',
    {
      title: 'Deployment Troubleshooting Guide',
      description: 'Systematic approach to diagnosing and resolving deployment issues.',
      inputSchema: {
        type: 'object',
        properties: {
          application_uuid: {
            type: 'string',
            description: 'UUID of the application having deployment issues'
          },
          issue_type: {
            type: 'string',
            enum: ['build-failure', 'startup-failure', 'runtime-error', 'performance-issue', 'connection-error'],
            description: 'Type of issue you are experiencing'
          },
          error_message: {
            type: 'string',
            description: 'Specific error message or description (optional)'
          },
          when_occurred: {
            type: 'string',
            enum: ['during-build', 'during-startup', 'after-deployment', 'intermittent'],
            description: 'When the issue occurs',
            default: 'during-build'
          }
        },
        required: ['application_uuid', 'issue_type']
      }
    },
    async (args: any) => {
      const { application_uuid, issue_type, error_message = '', when_occurred = 'during-build' } = args;
      
      return {
        content: [{
          type: 'text',
          text: `# 🔍 **Deployment Troubleshooting Guide**

## **Issue Summary**
- **Application**: ${application_uuid}
- **Issue Type**: ${issue_type}
- **Occurs**: ${when_occurred}
${error_message ? `- **Error**: ${error_message}` : ''}

## **Diagnostic Steps** 🕵️

### 1. **Gather Information**
\`\`\`
Use: get-application with uuid: ${application_uuid}
Use: get-application-logs with uuid: ${application_uuid}
Use: list-application-deployments with uuid: ${application_uuid}
\`\`\`

### 2. **Check Application Status**
- Current state and health
- Recent deployment history
- Resource usage and limits

${issue_type === 'build-failure' ? `## **Build Failure Troubleshooting** 🔨

### Common Causes & Solutions:

#### **Dependencies Issues**
- Check package.json/requirements.txt for version conflicts
- Verify all dependencies are available
- Clear build cache and retry

#### **Build Commands**
\`\`\`
Use: get-application to check build configuration
\`\`\`
- Verify install_command is correct
- Check build_command syntax
- Ensure build environment has required tools

#### **Environment Variables**
\`\`\`
Use: list-application-envs with uuid: ${application_uuid}
\`\`\`
- Verify all build-time variables are set
- Check for missing API keys or secrets
- Validate environment-specific configurations

#### **Resource Constraints**
- Build may be running out of memory
- Disk space issues
- CPU timeout limits` : ''}

${issue_type === 'startup-failure' ? `## **Startup Failure Troubleshooting** 🚀

### Common Causes & Solutions:

#### **Port Configuration**
\`\`\`
Use: get-application to check ports_exposes setting
\`\`\`
- Ensure application listens on correct port
- Verify PORT environment variable
- Check for port conflicts

#### **Database Connections**
\`\`\`
Use: list-databases to check database status
\`\`\`
- Verify database is running
- Check connection strings
- Test database connectivity

#### **Start Command Issues**
- Verify start_command is correct
- Check if application binary exists
- Ensure all runtime dependencies are installed` : ''}

${issue_type === 'runtime-error' ? `## **Runtime Error Troubleshooting** ⚠️

### Investigation Steps:

#### **Application Logs**
\`\`\`
Use: get-application-logs with uuid: ${application_uuid}
\`\`\`
- Look for stack traces
- Check for recurring error patterns
- Identify when errors started

#### **Resource Monitoring**
\`\`\`
Use: get-server-resources to check server capacity
\`\`\`
- Memory usage spikes
- CPU utilization
- Disk space availability

#### **External Dependencies**
- API endpoints returning errors
- Third-party service outages
- Network connectivity issues` : ''}

${issue_type === 'performance-issue' ? `## **Performance Issue Troubleshooting** 📈

### Performance Analysis:

#### **Resource Usage**
\`\`\`
Use: get-server-resources with server uuid
\`\`\`
- CPU utilization patterns
- Memory consumption
- I/O bottlenecks

#### **Database Performance**
\`\`\`
Use: list-databases and check each database
\`\`\`
- Query performance
- Connection pool exhaustion
- Index optimization needs

#### **Application Optimization**
- Code profiling
- Caching strategies
- Database query optimization` : ''}

${issue_type === 'connection-error' ? `## **Connection Error Troubleshooting** 🌐

### Network Diagnostics:

#### **Domain Configuration**
\`\`\`
Use: get-application to check domains setting
\`\`\`
- Verify domain is correctly configured
- Check DNS resolution
- SSL certificate validity

#### **Server Connectivity**
\`\`\`
Use: get-server to check server status
\`\`\`
- Server accessibility
- Firewall rules
- Network configuration

#### **Service Dependencies**
- Database connectivity
- External API accessibility
- Internal service communication` : ''}

## **Quick Fixes** ⚡

### 1. **Restart Application**
\`\`\`
Use: restart-application with uuid: ${application_uuid}
\`\`\`

### 2. **Redeploy Latest**
\`\`\`
Use: deploy-application with uuid: ${application_uuid}
\`\`\`

### 3. **Check Environment Variables**
\`\`\`
Use: list-application-envs with uuid: ${application_uuid}
\`\`\`

## **Advanced Debugging** 🔬

### 1. **Enable Debug Logging**
- Add debug environment variables
- Increase log verbosity
- Enable application profiling

### 2. **Resource Scaling**
- Increase memory limits
- Add more CPU resources
- Scale horizontally if possible

### 3. **Database Optimization**
- Analyze slow queries
- Optimize indexes
- Connection pool tuning

## **Prevention Strategies** 🛡️

- Implement health checks
- Set up monitoring alerts
- Regular performance testing
- Automated backup procedures
- Staging environment validation

## **When to Escalate** 📞

Contact support if:
- Server hardware issues suspected
- Network infrastructure problems
- Persistent issues after following all steps
- Security-related concerns

**Remember**: Always backup before making changes!`
        }]
      };
    }
  );

  // ============================================
  // PROJECT SETUP WORKFLOWS
  // ============================================
  
  server.registerPrompt(
    'setup-new-project',
    {
      title: 'New Project Setup with Best Practices',
      description: 'Complete workflow for setting up a new project in Coolify with security, monitoring, and deployment best practices.',
      inputSchema: {
        type: 'object',
        properties: {
          project_name: {
            type: 'string',
            description: 'Name for the new project'
          },
          project_type: {
            type: 'string',
            enum: ['web-application', 'api-service', 'database-only', 'full-stack', 'microservices'],
            description: 'Type of project to set up',
            default: 'web-application'
          },
          environment_setup: {
            type: 'string',
            enum: ['development-only', 'staging-production', 'full-pipeline'],
            description: 'Environment configuration',
            default: 'staging-production'
          },
          team_size: {
            type: 'string',
            enum: ['solo', 'small-team', 'large-team'],
            description: 'Team size for access control setup',
            default: 'small-team'
          },
          security_level: {
            type: 'string',
            enum: ['basic', 'enhanced', 'enterprise'],
            description: 'Security requirements level',
            default: 'enhanced'
          }
        },
        required: ['project_name', 'project_type']
      }
    },
    async (args: any) => {
      const { 
        project_name, 
        project_type = 'web-application', 
        environment_setup = 'staging-production',
        team_size = 'small-team',
        security_level = 'enhanced'
      } = args;
      
      return {
        content: [{
          type: 'text',
          text: `# 🏗️ **New Project Setup Guide**

## **Project Configuration**
- **Name**: ${project_name}
- **Type**: ${project_type}
- **Environments**: ${environment_setup}
- **Team Size**: ${team_size}
- **Security Level**: ${security_level}

## **Phase 1: Project Foundation** 🏛️

### 1. **Create Project Structure**
\`\`\`
Use: create-project with data:
{
  "name": "${project_name}",
  "description": "Project for ${project_type}",
  "server_uuid": "YOUR_SERVER_UUID"
}
\`\`\`

### 2. **Set Up Server Infrastructure**
\`\`\`
Use: list-servers to identify target server
Use: validate-server to ensure server is ready
\`\`\`

## **Phase 2: Environment Configuration** 🌍

${environment_setup === 'development-only' ? `### **Development Environment**
- Single environment for development and testing
- Relaxed security for rapid iteration
- Shared resources acceptable` : ''}

${environment_setup === 'staging-production' ? `### **Staging Environment**
\`\`\`
Create applications with naming convention:
- ${project_name}-staging
- ${project_name}-production
\`\`\`

### **Production Environment**
- Separate database instances
- Enhanced monitoring
- Backup procedures` : ''}

${environment_setup === 'full-pipeline' ? `### **Complete Pipeline**
\`\`\`
Create environments:
- ${project_name}-dev
- ${project_name}-staging  
- ${project_name}-production
\`\`\`

### **CI/CD Integration**
- Automated testing between stages
- Approval workflows
- Rollback procedures` : ''}

## **Phase 3: Application Setup** 📱

${project_type === 'web-application' ? `### **Web Application Configuration**
\`\`\`
Use: create-application with data:
{
  "name": "${project_name}",
  "git_repository": "https://github.com/yourorg/${project_name}",
  "build_pack": "nixpacks",
  "ports_exposes": "3000"
}
\`\`\`

**Recommended Stack:**
- Frontend: React/Vue/Angular
- Build: Vite/Webpack
- Deployment: Static or Node.js` : ''}

${project_type === 'api-service' ? `### **API Service Configuration**
\`\`\`
Use: create-application with data:
{
  "name": "${project_name}-api",
  "git_repository": "https://github.com/yourorg/${project_name}",
  "build_pack": "dockerfile",
  "ports_exposes": "8000"
}
\`\`\`

**Recommended Stack:**
- Backend: Node.js/Python/Go
- Database: PostgreSQL/MongoDB
- API: REST/GraphQL` : ''}

${project_type === 'full-stack' ? `### **Full-Stack Configuration**
\`\`\`
Frontend Application:
Use: create-application for frontend
Backend API:
Use: create-application for backend
Database:
Use: create-database for data storage
\`\`\`

**Architecture:**
- Separate frontend/backend deployments
- Shared database
- API communication` : ''}

## **Phase 4: Database Setup** 🗄️

${project_type !== 'database-only' ? `### **Application Database**
\`\`\`
Use: create-database with data:
{
  "name": "${project_name}-db",
  "image": "postgres:15",
  "postgres_user": "${project_name}_user",
  "postgres_db": "${project_name}_db"
}
\`\`\`` : `### **Database-Only Project**
\`\`\`
Primary Database:
Use: create-database with appropriate configuration

Backup Database:
Use: create-database for backup/replica
\`\`\``}

### **Database Best Practices**
- Regular automated backups
- Connection pooling
- Performance monitoring
- Security hardening

## **Phase 5: Security Configuration** 🔒

${security_level === 'basic' ? `### **Basic Security**
- HTTPS enforcement
- Basic authentication
- Environment variable encryption` : ''}

${security_level === 'enhanced' ? `### **Enhanced Security**
\`\`\`
Environment Variables:
Use: create-application-env for secure configs
\`\`\`

**Security Measures:**
- SSL/TLS certificates
- Secure environment variables
- Database access controls
- Network isolation
- Regular security updates` : ''}

${security_level === 'enterprise' ? `### **Enterprise Security**
**Advanced Measures:**
- Multi-factor authentication
- Role-based access control
- Audit logging
- Vulnerability scanning
- Compliance monitoring
- Backup encryption` : ''}

## **Phase 6: Monitoring & Alerts** 📊

### **Health Monitoring**
\`\`\`
Set up health checks for:
- Application availability
- Database connectivity  
- Resource utilization
- Response times
\`\`\`

### **Alerting Strategy**
- Critical: Immediate notification
- Warning: Daily summary
- Info: Weekly reports

## **Phase 7: Team Access** 👥

${team_size === 'solo' ? `### **Solo Developer**
- Full administrative access
- Simplified workflows
- Direct deployment access` : ''}

${team_size === 'small-team' ? `### **Small Team (2-5 people)**
\`\`\`
Use: get-team to configure team access
\`\`\`

**Roles:**
- Lead: Full access
- Developers: Deploy to staging
- Junior: Read-only production` : ''}

${team_size === 'large-team' ? `### **Large Team (5+ people)**
**Role-Based Access:**
- Administrators: Infrastructure
- Tech Leads: Production deployment
- Developers: Staging deployment
- QA: Testing environments
- Support: Read-only access` : ''}

## **Phase 8: Deployment Pipeline** 🚀

### **Automated Deployment**
1. **Git Integration**: Push to trigger deployment
2. **Testing**: Automated test execution  
3. **Staging**: Deploy to staging first
4. **Validation**: Health checks pass
5. **Production**: Deploy to production

### **Rollback Strategy**
- Quick rollback procedures
- Database migration rollbacks
- Traffic switching capabilities

## **Phase 9: Documentation** 📚

### **Project Documentation**
- Architecture overview
- Deployment procedures
- Troubleshooting guides
- API documentation
- Database schemas

### **Runbooks**
- Incident response procedures
- Maintenance procedures
- Backup/restore procedures
- Scaling procedures

## **Phase 10: Go-Live Checklist** ✅

### **Pre-Launch Validation**
- [ ] All environments tested
- [ ] Security scan completed
- [ ] Performance testing passed
- [ ] Backup procedures verified
- [ ] Monitoring configured
- [ ] Team access configured
- [ ] Documentation complete

### **Launch Day**
1. Final deployment to production
2. DNS configuration
3. SSL certificate activation
4. Monitoring validation
5. Team notification

## **Post-Launch** 🎯

### **Week 1**
- Monitor performance closely
- Address any immediate issues
- Collect user feedback
- Fine-tune configurations

### **Month 1**
- Review monitoring data
- Optimize performance
- Update documentation
- Plan next iterations

## **Maintenance Schedule** 🔄

- **Daily**: Health checks, log review
- **Weekly**: Security updates, backup verification
- **Monthly**: Performance review, capacity planning
- **Quarterly**: Security audit, disaster recovery testing

**Success!** Your ${project_name} project is now set up with industry best practices! 🎉

Use the \`troubleshoot-deployment\` prompt if you encounter any issues during setup.`
        }]
      };
    }
  );

  // Add more sophisticated prompts...
  
  server.registerPrompt(
    'database-setup',
    {
      title: 'Database Configuration & Best Practices',
      description: 'Comprehensive guide for setting up and optimizing databases in Coolify.',
      inputSchema: {
        type: 'object',
        properties: {
          database_type: {
            type: 'string',
            enum: ['postgresql', 'mysql', 'mongodb', 'redis', 'clickhouse'],
            description: 'Type of database to set up'
          },
          use_case: {
            type: 'string',
            enum: ['web-app', 'analytics', 'caching', 'real-time', 'data-warehouse'],
            description: 'Primary use case for the database'
          },
          expected_load: {
            type: 'string',
            enum: ['light', 'moderate', 'heavy', 'enterprise'],
            description: 'Expected database load',
            default: 'moderate'
          },
          backup_strategy: {
            type: 'string',
            enum: ['basic', 'comprehensive', 'enterprise'],
            description: 'Backup and recovery requirements',
            default: 'comprehensive'
          }
        },
        required: ['database_type', 'use_case']
      }
    },
    async (args: any) => {
      const { database_type, use_case, expected_load = 'moderate', backup_strategy = 'comprehensive' } = args;
      
      const dbConfigs = {
        postgresql: {
          image: 'postgres:15',
          port: 5432,
          env_vars: ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB']
        },
        mysql: {
          image: 'mysql:8.0',
          port: 3306,
          env_vars: ['MYSQL_ROOT_PASSWORD', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE']
        },
        mongodb: {
          image: 'mongo:7',
          port: 27017,
          env_vars: ['MONGO_INITDB_ROOT_USERNAME', 'MONGO_INITDB_ROOT_PASSWORD']
        },
        redis: {
          image: 'redis:7-alpine',
          port: 6379,
          env_vars: ['REDIS_PASSWORD']
        },
        clickhouse: {
          image: 'clickhouse/clickhouse-server:latest',
          port: 8123,
          env_vars: ['CLICKHOUSE_USER', 'CLICKHOUSE_PASSWORD', 'CLICKHOUSE_DB']
        }
      };
      
      const config = dbConfigs[database_type as keyof typeof dbConfigs];
      
      return {
        content: [{
          type: 'text',
          text: `# 🗄️ **${database_type.toUpperCase()} Database Setup Guide**

## **Configuration Summary**
- **Database**: ${database_type}
- **Use Case**: ${use_case}
- **Expected Load**: ${expected_load}
- **Backup Strategy**: ${backup_strategy}
- **Recommended Image**: ${config.image}

## **Step 1: Database Creation** 🏗️

### **Basic Configuration**
\`\`\`
Use: create-database with data:
{
  "name": "my-${database_type}-db",
  "image": "${config.image}",
  "server_uuid": "YOUR_SERVER_UUID",
  "project_uuid": "YOUR_PROJECT_UUID"
  ${config.env_vars.map(env => `"${env.toLowerCase()}": "secure_value"`).join(',\n  ')}
}
\`\`\`

### **Environment Variables**
${config.env_vars.map(env => `- **${env}**: ${env.includes('PASSWORD') ? 'Strong password (min 12 chars)' : 'Configuration value'}`).join('\n')}

## **Step 2: Performance Optimization** ⚡

${database_type === 'postgresql' ? `### **PostgreSQL Optimization**

#### **Memory Settings**
- \`shared_buffers\`: 25% of RAM
- \`effective_cache_size\`: 75% of RAM
- \`work_mem\`: Based on concurrent connections

#### **Connection Settings**
- \`max_connections\`: Based on application needs
- \`connection_pooling\`: Use PgBouncer for high load

#### **Indexing Strategy**
- Primary keys on all tables
- Indexes on frequently queried columns
- Composite indexes for multi-column queries` : ''}

${database_type === 'mysql' ? `### **MySQL Optimization**

#### **InnoDB Configuration**
- \`innodb_buffer_pool_size\`: 70% of RAM
- \`innodb_log_file_size\`: 256MB+
- \`innodb_flush_log_at_trx_commit\`: 2 for performance

#### **Query Optimization**
- Enable slow query log
- Use EXPLAIN for query analysis
- Optimize table structure` : ''}

${database_type === 'mongodb' ? `### **MongoDB Optimization**

#### **Memory Management**
- WiredTiger cache: 50% of RAM
- Index builds in background
- Appropriate shard keys

#### **Query Performance**
- Create indexes for common queries
- Use aggregation pipeline efficiently
- Monitor with MongoDB Compass` : ''}

${database_type === 'redis' ? `### **Redis Optimization**

#### **Memory Configuration**
- \`maxmemory\`: Set appropriate limit
- \`maxmemory-policy\`: Choose eviction policy
- Persistence: RDB vs AOF

#### **Performance Tuning**
- Use pipelining for bulk operations
- Optimize data structures
- Monitor memory usage` : ''}

## **Step 3: Security Hardening** 🔒

### **Access Control**
\`\`\`
Use: create-application-env to set secure connection strings
\`\`\`

#### **Security Checklist**
- [ ] Strong passwords (min 12 characters)
- [ ] Network isolation (internal access only)
- [ ] Regular security updates
- [ ] Encrypted connections (SSL/TLS)
- [ ] Limited user privileges
- [ ] Audit logging enabled

### **Connection Security**
${database_type === 'postgresql' ? `- Enable SSL: \`sslmode=require\`
- Use connection pooling
- Limit concurrent connections` : ''}
${database_type === 'mysql' ? `- Enable SSL connections
- Use mysql_native_password
- Disable remote root access` : ''}
${database_type === 'mongodb' ? `- Enable authentication
- Use TLS/SSL encryption
- Network binding restrictions` : ''}

## **Step 4: Backup Strategy** 💾

${backup_strategy === 'basic' ? `### **Basic Backup**
- Daily automated backups
- 7-day retention
- Local storage only

\`\`\`
# Set up basic backup schedule
Use database-specific backup commands
\`\`\`` : ''}

${backup_strategy === 'comprehensive' ? `### **Comprehensive Backup**
- Multiple daily backups
- 30-day retention
- Offsite backup storage
- Point-in-time recovery

#### **Backup Schedule**
- Full backup: Daily at 2 AM
- Incremental: Every 4 hours
- Transaction log backup: Every 15 minutes` : ''}

${backup_strategy === 'enterprise' ? `### **Enterprise Backup**
- Continuous backup
- Geographic redundancy
- Instant recovery capabilities
- Compliance requirements

#### **Advanced Features**
- Real-time replication
- Automated failover
- Disaster recovery testing
- Compliance reporting` : ''}

## **Step 5: Monitoring Setup** 📊

### **Key Metrics to Monitor**
- Connection count and utilization
- Query performance and slow queries
- Memory and CPU usage
- Disk I/O and storage usage
- Replication lag (if applicable)

### **Alerting Thresholds**
- **Critical**: 90% memory usage, connection limit reached
- **Warning**: 75% disk usage, slow query increase
- **Info**: Daily performance summary

## **Step 6: Application Integration** 🔌

### **Connection Configuration**
\`\`\`
Use: create-application-env with connection details:

DATABASE_URL: ${database_type}://username:password@hostname:${config.port}/database
DB_HOST: database-service-name
DB_PORT: ${config.port}
DB_NAME: your_database_name
DB_USER: your_username
DB_PASS: your_secure_password
\`\`\`

### **Connection Pooling**
${database_type === 'postgresql' ? `- Use PgBouncer or application-level pooling
- Pool size: 10-20 connections per app instance
- Connection timeout: 30 seconds` : ''}
${database_type === 'mysql' ? `- Use connection pooling in application
- Pool size: 5-15 connections per instance
- Validate connections before use` : ''}

## **Step 7: Performance Testing** 🚀

### **Load Testing**
1. **Baseline Performance**
   - Single connection benchmarks
   - Query response times
   - Throughput measurements

2. **Stress Testing**
   - Maximum connection limits
   - High query volume
   - Memory pressure scenarios

3. **Endurance Testing**
   - 24-hour sustained load
   - Memory leak detection
   - Performance degradation

## **Step 8: Maintenance Procedures** 🔧

### **Regular Maintenance**
- **Daily**: Monitor performance metrics
- **Weekly**: Review slow queries, check backups
- **Monthly**: Update statistics, optimize indexes
- **Quarterly**: Security patches, capacity planning

### **Maintenance Commands**
${database_type === 'postgresql' ? `\`\`\`sql
-- Update statistics
ANALYZE;
-- Rebuild indexes
REINDEX DATABASE your_database;
-- Clean up old data
VACUUM ANALYZE;
\`\`\`` : ''}

## **Troubleshooting Guide** 🔍

### **Common Issues**
1. **Connection Refused**
   - Check database status: \`get-database\`
   - Verify network connectivity
   - Review connection limits

2. **Slow Performance**
   - Analyze slow queries
   - Check index usage
   - Monitor resource usage

3. **Storage Issues**
   - Monitor disk space
   - Archive old data
   - Optimize table structure

### **Emergency Procedures**
- Database recovery from backup
- Connection limit increase
- Performance emergency response

## **Success Checklist** ✅

- [ ] Database created and running
- [ ] Security configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup complete
- [ ] Application connected
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Team trained

**Your ${database_type} database is now production-ready!** 🎉

For ongoing support, use the \`troubleshoot-deployment\` prompt for any issues.`
        }]
      };
    }
  );
}
