import * as React from 'react';

const useMountedRef = (): React.MutableRefObject<boolean> => {
  const mountedRef = React.useRef(false);

  React.useLayoutEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
};

export default useMountedRef;
