#!/usr/bin/env node
console.log("Starting MCP test...");
console.log("Environment variables:");
console.log("COOLIFY_BASE_URL:", process.env.COOLIFY_BASE_URL);
console.log("COOLIFY_API_TOKEN:", process.env.COOLIFY_API_TOKEN ? "***SET***" : "NOT SET");

// Try to import the built index.js
try {
  console.log("Attempting to load index.js...");
  await import('./build/index.js');
} catch (error) {
  console.error("Error loading index.js:", error);
  process.exit(1);
}