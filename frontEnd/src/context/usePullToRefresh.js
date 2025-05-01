import { useEffect } from "react";

const usePullToRefresh = () => {
  useEffect(() => {
    let startY = 0;
    let isPullingDown = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPullingDown = true;
      }
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;

      if (isPullingDown && diffY > 60) {
        window.location.reload();
        isPullingDown = false;
      }
    };

    const handleTouchEnd = () => {
      isPullingDown = false;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
};

export default usePullToRefresh;
