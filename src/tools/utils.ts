/**
 * Utility functions for MCP tool responses
 */

import { z } from 'zod';

/**
 * Helper function to safely format tool response
 */
export function createToolResponse(data: any, isError: boolean = false): any {
  let responseText: string;
  
  try {
    if (data === null || data === undefined) {
      responseText = isError ? 'Error: No data received from API' : 'No data available';
    } else if (typeof data === 'string') {
      responseText = data;
    } else {
      responseText = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    responseText = `Error formatting response: ${error instanceof Error ? error.message : 'Unknown error'}`;
    isError = true;
  }

  return {
    content: [{
      type: 'text',
      text: responseText
    }],
    isError
  };
}

/**
 * Helper function to safely call API and handle errors
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  operation: string
): Promise<any> {
  try {
    const response = await apiCall();
    return createToolResponse(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return createToolResponse(`Failed to ${operation}: ${errorMessage}`, true);
  }
}

/**
 * Common Zod schemas for tool inputs
 */
export const schemas = {
  uuid: z.string().describe('UUID of the resource'),
  
  data: z.object({
    name: z.string().optional().describe('Name'),
    description: z.string().optional().describe('Description')
  }),
  
  envData: z.object({
    key: z.string().describe('Environment variable key'),
    value: z.string().describe('Environment variable value'),
    is_build_time: z.boolean().optional().describe('Whether this is a build-time variable')
  })
};
