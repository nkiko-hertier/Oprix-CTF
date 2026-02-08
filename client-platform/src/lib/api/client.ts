export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://oprix-api.up.railway.app/api/v1';

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorBody?.message ?? 'Request failed',
      status: response.status,
      details: errorBody
    };
    throw error;
  }

  return response.json() as Promise<T>;
}
