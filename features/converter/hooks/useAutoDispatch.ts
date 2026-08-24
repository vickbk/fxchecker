import { startTransition, useEffect, useRef } from "react";

export function useAutoDispatch<TPayload>(
  dispatch: (payload: TPayload) => void,
  payload: TPayload,
  deps: React.DependencyList,
) {
  const dispatchRef = useRef(dispatch);

  useEffect(() => {
    startTransition(() => {
      dispatchRef.current(payload);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
