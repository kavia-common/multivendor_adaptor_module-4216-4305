import axios from 'axios';
import { StandardResponse, ErrorResponse, AuthRequest, AuthResponse, MappingConfigRequest, ServiceProvisionRequest } from './types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_BASE_URL || '/api';

let token: string | null = null;

// PUBLIC_INTERFACE
export function setAuthToken(newToken: string | null) {
  /** Set or clear the bearer token used by the API client */
  token = newToken;
}

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Request interceptor to attach bearer token.
 * Axios v1 uses AxiosHeaders; to avoid type conflicts, set via set() if available.
 */
api.interceptors.request.use((config) => {
  if (token) {
    const authValue = `Bearer ${token}`;
    if (config.headers && typeof (config.headers as any).set === 'function') {
      (config.headers as any).set('Authorization', authValue);
    } else {
      config.headers = { ...(config.headers || {}), Authorization: authValue } as any;
    }
  }
  return config;
});

// response interceptor to standardize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error
    const status = error?.response?.status;
    const data = error?.response?.data as ErrorResponse | undefined;
    const normalized: ErrorResponse = {
      error: data?.error || error.message || 'Request failed',
      details: data?.details || (status ? `HTTP ${status}` : undefined)
    };
    // Tag for auth handling
    (normalized as any).status = status;
    return Promise.reject(normalized);
  }
);

// PUBLIC_INTERFACE
export async function login(body: AuthRequest): Promise<AuthResponse> {
  /** Login to obtain JWT token and roles */
  const res = await api.post<AuthResponse>('/login', body);
  return res.data;
}

// PUBLIC_INTERFACE
export async function logout(): Promise<StandardResponse> {
  /** Logout to end user session */
  const res = await api.post<StandardResponse>('/logout');
  return res.data;
}

// PUBLIC_INTERFACE
export async function uploadModel(modelType: 'NB' | 'SB', file: File): Promise<StandardResponse> {
  /** Upload model via multipart/form-data: fields modelType, file */
  const form = new FormData();
  form.append('modelType', modelType);
  form.append('file', file);
  const res = await api.post<StandardResponse>('/upload-model', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function configureMapping(body: MappingConfigRequest): Promise<StandardResponse> {
  /** Configure transformation mapping */
  const res = await api.post<StandardResponse>('/configure-mapping', body);
  return res.data;
}

// PUBLIC_INTERFACE
export async function provisionService(body: ServiceProvisionRequest): Promise<StandardResponse> {
  /** Trigger service provisioning */
  const res = await api.post<StandardResponse>('/provision-service', body);
  return res.data;
}

// PUBLIC_INTERFACE
export async function getStatus(): Promise<StandardResponse> {
  /** Retrieve system status */
  const res = await api.get<StandardResponse>('/status');
  return res.data;
}

// PUBLIC_INTERFACE
export async function getVersioning(): Promise<StandardResponse> {
  /** Retrieve versioning info */
  const res = await api.get<StandardResponse>('/versioning');
  return res.data;
}

// PUBLIC_INTERFACE
export async function getAuditLogs(): Promise<StandardResponse> {
  /** Retrieve audit logs */
  const res = await api.get<StandardResponse>('/audit-logs');
  return res.data;
}

export default api;
