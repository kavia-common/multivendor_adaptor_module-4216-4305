import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse } from './types';

type Notifier = (type: 'success'|'error'|'info', message: string) => void;

// PUBLIC_INTERFACE
export function useApiHandler(onNotify?: Notifier) {
  /** Wrap an async API call and handle errors consistently, redirect on 401 */
  const navigate = useNavigate();

  const handle = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      const result = await fn();
      return result;
    } catch (e) {
      const err = e as ErrorResponse & { status?: number };
      if (err.status === 401) {
        onNotify?.('error', 'Session expired. Please login again.');
        navigate('/login', { replace: true });
      } else {
        onNotify?.('error', err.error || 'Request failed');
      }
      return null;
    }
  }, [navigate, onNotify]);

  return handle;
}
