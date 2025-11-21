import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Formats API errors into user-friendly messages
 */
export function formatApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response;
    
    if (response) {
      // Try to extract error message from response
      const data = response.data;
      
      if (typeof data === 'string') {
        return data;
      }
      
      if (data?.message) {
        return data.message;
      }
      
      if (data?.error) {
        return data.error;
      }
      
      // Handle validation errors
      if (data?.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors)
          .flat()
          .filter(Boolean)
          .join(', ');
        if (errorMessages) {
          return errorMessages;
        }
      }
      
      // Default status-based messages
      switch (response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized. Please log in.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'A conflict occurred. This resource may already exist.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return `Error ${response.status}: ${response.statusText || 'Unknown error'}`;
      }
    }
    
    if (error.request) {
      return 'Network error. Please check your connection.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handles API errors and shows toast notification
 */
export function handleApiError(error: unknown, customMessage?: string): void {
  const message = customMessage || formatApiError(error);
  
  // Log error for debugging
  if (import.meta.env.DEV) {
    console.error('[API Error]', error);
  }
  
  toast.error(message);
}

/**
 * Logs error to console (and potentially to error reporting service)
 */
export function logError(error: Error, context?: string): void {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  console.error('[Error Log]', errorInfo);
  
  // TODO: Integrate with error reporting service (e.g., Sentry, LogRocket)
  // if (import.meta.env.PROD) {
  //   errorReportingService.captureException(error, { extra: errorInfo });
  // }
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Retry failed');
}

