import { useEffect } from "react";

const useFrame = (callback: (delta: number) => void) => {
  const ctrler = new AbortController();

  useEffect(() => {
    const animate: FrameRequestCallback = (delta) => {
      if (ctrler.signal.aborted) return;

      callback(delta);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => ctrler.abort();
  }, [callback, ctrler]);

  return ctrler;
};

export default useFrame;
