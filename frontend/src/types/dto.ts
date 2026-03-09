export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
}

export interface RegisterResponse {
  token: string;
  userId: number;
  username: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  userId: number;
}

export interface ProductUpdateRequest {
  name: string;
  description: string;
  price: number;
  userId: number;
}

export interface ProductResponse {
  id: number;
  articleNumber: string;
  name: string;
  description: string;
  price: number;
  userId: number;
}
