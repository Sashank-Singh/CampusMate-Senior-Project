import { useCallback } from 'react';
import { useMcp } from './mcpService';

export const useAuth = () => {
  const { callTool } = useMcp();

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const response = await callTool(
      'github.com/alexander-zuev/supabase-mcp-server',
      'call_auth_admin_method',
      {
        method: 'signInWithEmail',
        params: {
          email,
          password
        }
      }
    );
    
    return response;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const response = await callTool(
      'github.com/alexander-zuev/supabase-mcp-server',
      'call_auth_admin_method',
      {
        method: 'create_user',
        params: {
          email,
          password,
          email_confirm: true
        }
      }
    );
    
    return response;
  }, []);

  return {
    signInWithEmail,
    signUpWithEmail
  };
};
