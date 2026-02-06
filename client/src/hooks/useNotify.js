import toast from 'react-hot-toast';

export const useNotify = () => {
  const success = (msg) => toast.success(msg, {
    style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' },
    iconTheme: { primary: '#6366f1', secondary: '#fff' },
  });

  const error = (msg) => toast.error(msg, {
    style: { background: '#ef4444', color: '#fff' },
  });

  const loading = (msg) => toast.loading(msg, {
    style: { background: '#1e293b', color: '#fff' },
  });

  const dismiss = (id) => toast.dismiss(id);

  return { success, error, loading, dismiss };
};