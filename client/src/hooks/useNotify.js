import { toast } from 'react-hot-toast';

export const useNotify = () => {
  const success = (message) => toast.success(message, {
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
  });
  
  const error = (message) => toast.error(message, {
    style: { background: '#1e293b', color: '#fff', border: '1px solid #ef4444' }
  });

  return { success, error };
};