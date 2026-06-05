import type { PermissionKey, RoleName } from '../constants/roles';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: RoleName[];
  permissions: PermissionKey[];
  mfaEnabled: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
