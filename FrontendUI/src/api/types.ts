export type ModelType = 'NB' | 'SB';

export interface MappingRule {
  [key: string]: unknown;
}

export interface MappingConfigRequest {
  sourceModelId: string;
  targetModelId: string;
  mappingRules: MappingRule[];
}

export interface ServiceProvisionRequest {
  serviceType: string;
  parameters: Record<string, unknown>;
  mappingId: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  roles: string[];
}

export interface StandardResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export interface AuditLogEntry {
  [key: string]: unknown;
}
