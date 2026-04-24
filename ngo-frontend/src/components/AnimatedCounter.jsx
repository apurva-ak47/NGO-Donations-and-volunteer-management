import { useEffect, useState } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedCounter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame;
    const start = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <Motion.span ref={ref} layout>
      {count.toLocaleString("en-IN")}
      {suffix}
    </Motion.span>
  );
}
