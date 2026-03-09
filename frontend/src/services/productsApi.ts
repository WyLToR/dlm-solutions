import type { ProductCreateRequest, ProductResponse, ProductUpdateRequest } from "../types/dto";
import { getLiveAuthCookie } from "../utils/authCookie";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiErrorPayload {
  message?: string;
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "message" in value;
}

function getAuthHeaders(): HeadersInit {
  const session = getLiveAuthCookie();
  if (!session) {
    throw new ApiError("Authentication expired. Please log in again.", 401);
  }

  return {
    Authorization: `Bearer ${session.token}`,
  };
}

async function parseApiError(response: Response): Promise<never> {
  let message = "Request failed.";

  try {
    const payload: unknown = await response.json();
    if (isApiErrorPayload(payload) && typeof payload.message === "string") {
      message = payload.message;
    }
  } catch {
    // Fallback message is used when the error body is not JSON.
  }

  throw new ApiError(message, response.status);
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    await parseApiError(response);
  }

  return (await response.json()) as T;
}

async function requestNoContent(path: string, options?: RequestInit): Promise<void> {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    await parseApiError(response);
  }
}

export async function fetchProducts(): Promise<ProductResponse[]> {
  return requestJson<ProductResponse[]>("/api/Products");
}

export async function fetchProductById(id: number): Promise<ProductResponse> {
  return requestJson<ProductResponse>(`/api/Products/${id}`);
}

export async function createProduct(payload: ProductCreateRequest): Promise<ProductResponse> {
  return requestJson<ProductResponse>("/api/Products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id: number, payload: ProductUpdateRequest): Promise<void> {
  return requestNoContent(`/api/Products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  return requestNoContent(`/api/Products/${id}`, {
    method: "DELETE",
  });
}

export { ApiError };
