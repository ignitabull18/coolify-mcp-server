#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = 'src/tools-robust.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Tools that need only UUID parameter
const uuidOnlyTools = [
  'get-database', 'delete-database', 'start-database', 'stop-database', 'restart-database',
  'get-service', 'delete-service', 'start-service', 'stop-service', 'restart-service',
  'get-server', 'delete-server', 'get-server-resources', 'get-server-domains', 'validate-server',
  'get-project', 'delete-project', 'get-project-environment',
  'get-deployment', 'list-application-deployments',
  'get-team', 'delete-team',
  'start-application', 'stop-application', 'restart-application', 'delete-application',
  'get-application-logs', 'list-application-envs'
];

// Tools that need only DATA parameter  
const dataOnlyTools = [
  'create-service', 'create-server', 'create-project', 'create-team'
];

// Tools that need UUID + DATA parameters
const uuidDataTools = [
  'update-database', 'update-service', 'update-server', 'update-project', 'update-team',
  'update-application', 'create-application-env', 'update-application-env', 'delete-application-env',
  'create-service-env', 'update-service-env', 'delete-service-env'
];

console.log('Fixing tool schemas...');

// Fix UUID-only tools
uuidOnlyTools.forEach(toolName => {
  const pattern = new RegExp(`(server\\.registerTool\\(\\s*'${toolName.replace(/[-]/g, '\\-')}',[\\s\\S]*?description: '[^']*')([\\s\\S]*?)(},\\s*async)`, 'g');
  
  content = content.replace(pattern, (match, prefix, middle, suffix) => {
    // Check if it already has proper inputSchema
    if (middle.includes('inputSchema: {') && middle.includes('z.string()')) {
      return match; // Already fixed
    }
    
    // Remove old inputSchema if exists
    const cleanMiddle = middle.replace(/,?\s*inputSchema:\s*{[\s\S]*?}\s*}/g, '');
    
    return `${prefix},
      inputSchema: {
        uuid: z.string().describe('UUID of the ${toolName.replace(/-/g, ' ')}')
      }${suffix}`;
  });
});

// Fix data-only tools
dataOnlyTools.forEach(toolName => {
  const pattern = new RegExp(`(server\\.registerTool\\(\\s*'${toolName.replace(/[-]/g, '\\-')}',[\\s\\S]*?description: '[^']*')([\\s\\S]*?)(},\\s*async)`, 'g');
  
  content = content.replace(pattern, (match, prefix, middle, suffix) => {
    // Check if it already has proper inputSchema
    if (middle.includes('inputSchema: {') && middle.includes('z.object(')) {
      return match; // Already fixed
    }
    
    // Remove old inputSchema if exists
    const cleanMiddle = middle.replace(/,?\s*inputSchema:\s*{[\s\S]*?}\s*}/g, '');
    
    return `${prefix},
      inputSchema: {
        data: z.object({
          name: z.string().describe('Name'),
          description: z.string().optional().describe('Description')
        }).passthrough()
      }${suffix}`;
  });
});

// Fix UUID + data tools
uuidDataTools.forEach(toolName => {
  const pattern = new RegExp(`(server\\.registerTool\\(\\s*'${toolName.replace(/[-]/g, '\\-')}',[\\s\\S]*?description: '[^']*')([\\s\\S]*?)(},\\s*async)`, 'g');
  
  content = content.replace(pattern, (match, prefix, middle, suffix) => {
    // Check if it already has proper inputSchema
    if (middle.includes('inputSchema: {') && middle.includes('z.string()') && middle.includes('z.object(')) {
      return match; // Already fixed
    }
    
    // Remove old inputSchema if exists
    const cleanMiddle = middle.replace(/,?\s*inputSchema:\s*{[\s\S]*?}\s*}/g, '');
    
    return `${prefix},
      inputSchema: {
        uuid: z.string().describe('UUID of the ${toolName.replace(/-/g, ' ')}'),
        data: z.object({
          name: z.string().optional().describe('Name'),
          description: z.string().optional().describe('Description')
        }).passthrough()
      }${suffix}`;
  });
});

fs.writeFileSync(filePath, content);
console.log('Tool schemas fixed!');
