import { useState, useEffect } from 'react';

function useDebounce(value: any, delay: any) {
  const [debouncedValue, setDebouncedValue]: [any, React.Dispatch<any>] = useState(value);

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return debouncedValue;
}

export default useDebounce;
