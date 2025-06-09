'use client';

import type { ReactNode } from 'react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  animationClassName?: string;
  delay?: string; // e.g., 'delay-300' for Tailwind JIT, or full 'animation-delay-300ms'
  duration?: string; // e.g., 'duration-500' or 'animation-duration-500ms'
  threshold?: number;
  triggerOnce?: boolean;
}

export function ScrollAnimationWrapper({
  children,
  className,
  animationClassName = 'animate-fade-in-up',
  delay,
  duration,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollAnimationWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, triggerOnce]);
  
  const style = {
    animationDelay: delay && !delay.startsWith('delay-') ? delay : undefined,
    animationDuration: duration && !duration.startsWith('duration-') ? duration : undefined,
  } as React.CSSProperties;


  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        'opacity-0', // Start hidden
        isVisible && `${animationClassName} opacity-100`, // Apply animation when visible
        delay && delay.startsWith('delay-') ? delay : '', // Tailwind JIT delay class
        duration && duration.startsWith('duration-') ? duration : '', // Tailwind JIT duration class
        className
      )}
    >
      {children}
    </div>
  );
}
