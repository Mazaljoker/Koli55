# API Services Architecture (Deprecated)

> **Note:** Cette documentation est déplacée et remplacée par une version plus complète et à jour disponible ici : [Architecture des services API](../api_services.md)

This directory contains a standardized set of services for interfacing with Supabase Edge Functions in our Koli55 platform.

## Overview

The API service layer provides a clean abstraction over direct Supabase function calls, with the following benefits:

- Type safety with TypeScript interfaces for all requests and responses
- Consistent error handling
- Centralized response parsing
- Standardized patterns for CRUD operations

## Available Services

The following services are available:

- **assistantsService**: Managing AI assistants
- **knowledgeBaseService**: Managing knowledge bases and their files
- **filesService**: File operations (upload, retrieve, list)
- **messagesService**: Managing messages in conversations
- **callsService**: Phone call operations
- **organizationService**: Organization management and members
- **squadsService**: Team/squad management
- **workflowsService**: Workflow definition and execution
- **webhooksService**: Managing webhooks
- **analyticsService**: Analytics and usage data
- **phoneNumbersService**: Phone number provisioning and management
- **testSuitesService**: Test suite management
- **testSuiteTestsService**: Individual tests within test suites
- **testSuiteRunsService**: Execution results for test suites
- **functionsService**: Managing function/tool definitions
- **customFunctionsService**: Invoking custom functions

## Usage

You can import and use these services in your components with a consistent pattern:

```typescript
// Import the service
import { assistantsService } from 'lib/api';

// Somewhere in your component
const createAssistant = async () => {
  const payload = {
    name: 'My Assistant',
    instructions: 'You are a helpful assistant.',
  };
  
  const response = await assistantsService.create(payload);
  
  if (response.success) {
    // Handle success case with response.data
    console.log('Created assistant:', response.data);
  } else {
    // Handle error case with response.message
    console.error('Failed to create assistant:', response.message);
  }
};
```

## Response Structure

All services return responses with a consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationData;
}

interface PaginationData {
  total: number;
  limit: number;
  page: number;
  has_more: boolean;
}
```

## Error Handling

All services handle errors consistently:

1. Network/API errors are caught and transformed into error responses
2. Supabase function errors are transformed into error responses
3. Success/error status is clearly indicated with the `success` flag

## Contributing

When adding new services:

1. Follow the established patterns for service implementation
2. Create appropriate TypeScript interfaces for all payloads and responses
3. Include proper JSDoc comments for all public functions
4. Group your service functions into an exported object
5. Update the main `index.ts` to export both the service and its types 