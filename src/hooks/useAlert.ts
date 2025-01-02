import { useState, useEffect } from 'react';
// Hook for displaying alerts, as well as clearing them
// As 4+ components use it, it's in a separate file/hook
const useAlert = (duration: number = 5000) => {
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [alertMessage, duration]);

  return { alertMessage, setAlertMessage };
};

export default useAlert;
