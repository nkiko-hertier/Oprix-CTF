import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthToken(): Promise<string | null> {
  try {
    // Try to get token from Clerk if available
    if (typeof window !== 'undefined' && (window as any).Clerk) {
      const session = await (window as any).Clerk.session.getToken({template: "default"});
      if (session) {
        return session;
      }
    }
  } catch (error) {
    console.log("No Clerk token available");
  }
  return null;
}
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
) {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  const token = await getAuthToken();

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.errors) {
    toast.error(json?.errors?.[0] || json?.message || "Request failed");
    throw {
      status: res.status,
      message: json?.errors[0] || json?.message || "Request failed",
      data: json,
    };
  }

  return json;
}


type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: { on401: UnauthorizedBehavior }) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      // const [path, params] = queryKey; // destructure queryKey
      // const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
      const [path, params] = queryKey;
      const pathStr = path as string; // assert path is string
      const url = new URL(pathStr.startsWith("http") ? pathStr : `${API_BASE_URL}${pathStr}`);


      // If params is an object, append as query params
      if (params && typeof params === "object") {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const token = await getAuthToken();
      const res = await fetch(url.toString(), {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
//   ({ on401: unauthorizedBehavior }) =>
//   async ({ queryKey }) => {
//     const path = queryKey.join("/") as string;
//     const fullUrl = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
//     const token = await getAuthToken();

//     const res = await fetch(fullUrl, {
//       headers: {
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       credentials: "include",
//     });

//     if (unauthorizedBehavior === "returnNull" && res.status === 401) {
//       return null;
//     }

//     await throwIfResNotOk(res);
//     return await res.json();
//   };


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
