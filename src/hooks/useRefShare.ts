import {
  type ForwardedRef,
  type MutableRefObject,
  type RefObject,
  useEffect,
} from "react";

const useRefShare = <T>(
  srcRef: RefObject<T> | MutableRefObject<T>,
  ...refs: (ForwardedRef<T> | MutableRefObject<T> | ((cur: T) => void))[]
) => {
  useEffect(() => {
    if (!srcRef?.current) return;

    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === "function") ref(srcRef.current);

      if ("current" in ref) ref.current = srcRef.current;
    }
  }, [srcRef, refs]);
};

export default useRefShare;
