'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  target: number;
  suffix?: string;
  duration?: number;
  prefix?: string;
  isPercentage?: boolean;
  isDecimal?: boolean;
}

export default function CountUp({
  target,
  suffix = '',
  duration = 2000,
  prefix = '',
  isPercentage = false,
  isDecimal = false,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(target * progress);
      setValue(currentValue);

      if (progress === 1) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isVisible, target, duration]);

  const formatValue = () => {
    if (isDecimal) {
      return `${prefix}${(value / 10).toFixed(1)}${suffix}`;
    }
    if (isPercentage) {
      return `${prefix}${value}${suffix}`;
    }
    return `${prefix}${value.toLocaleString()}${suffix}`;
  };

  return <span ref={elementRef}>{formatValue()}</span>;
}
