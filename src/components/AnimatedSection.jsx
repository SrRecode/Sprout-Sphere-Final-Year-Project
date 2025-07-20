import React, { useEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedSection = forwardRef((props, ref) => {
  const { children, className = '', as: Component = 'section', ...rest } = props;
  const internalRef = useRef(null);
  const sectionRef = ref || internalRef;

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return;

    const childrenToAnimate = gsap.utils.toArray(sectionElement.children);

    if (childrenToAnimate.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        }
      });

      tl.fromTo(childrenToAnimate, 
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
        }
      );
    }
  }, [children, sectionRef]);

  return (
    <Component ref={sectionRef} className={className} {...rest}>
      {children}
    </Component>
  );
});

AnimatedSection.displayName = 'AnimatedSection';

export default AnimatedSection; 