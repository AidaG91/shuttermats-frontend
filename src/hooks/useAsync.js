import { useEffect, useState } from "react";

const INITIAL_STATE = { data: undefined, loading: true, error: null };

export function useAsync(asyncFn, deps) {
  const [state, setState] = useState(INITIAL_STATE);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    asyncFn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled)
          setState((previous) => ({ ...previous, loading: false, error }));
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const refetch = () => setReloadToken((token) => token + 1);

  return { ...state, refetch };
}
