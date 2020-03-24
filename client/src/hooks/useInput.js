import { useState } from 'react';

/** 
 * ============================================
 *   Hook for binding form inputs
 * ============================================
 */
export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    clear: () => setValue(''),
    bindProps: {
      value,
      onChange: (e) => {
        setValue(e.target.value);
      }
    }
  };
}
