import * as React from 'react';

type Callback = () => void;

const useWindowClick = (cb: Callback): void => {
  React.useEffect(() => {
    window.addEventListener('click', cb);

    return () => window.removeEventListener('click', cb);
  }, [cb]);
};

export default useWindowClick;
