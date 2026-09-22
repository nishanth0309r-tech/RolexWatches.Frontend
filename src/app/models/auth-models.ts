export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  role: 'Customer' | 'Admin';
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserDto;
}

// Matches the backend's ApiResponse<T> wrapper (Security/Common module)
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}
