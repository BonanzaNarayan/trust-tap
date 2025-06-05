import anime from 'animejs';

export const fadeIn = (element: Element) => {
  return anime({
    targets: element,
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });
};

export const slideUp = (element: Element, delay = 0) => {
  return anime({
    targets: element,
    translateY: [20, 0],
    opacity: [0, 1],
    delay,
    duration: 600,
    easing: 'easeOutCubic'
  });
};

export const staggerChildren = (container: Element, selector: string, staggerDelay = 100) => {
  return anime({
    targets: Array.from(container.querySelectorAll(selector)),
    translateY: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(staggerDelay),
    duration: 600,
    easing: 'easeOutCubic'
  });
};

export const buttonHoverAnimation = (element: HTMLElement) => {
  element.addEventListener('mouseenter', () => {
    anime({
      targets: element,
      scale: 1.05,
      duration: 200,
      easing: 'easeOutCubic'
    });
  });
  
  element.addEventListener('mouseleave', () => {
    anime({
      targets: element,
      scale: 1,
      duration: 200,
      easing: 'easeOutCubic'
    });
  });
};

export const formFieldFocusAnimation = (element: HTMLElement) => {
  const label = element.previousElementSibling;
  
  element.addEventListener('focus', () => {
    anime({
      targets: label,
      translateY: [-2, -5],
      scale: 0.95,
      color: '#4F46E5',
      duration: 200,
      easing: 'easeOutCubic'
    });
  });
  
  element.addEventListener('blur', () => {
    anime({
      targets: label,
      translateY: -2,
      scale: 1,
      color: '#334155',
      duration: 200,
      easing: 'easeOutCubic'
    });
  });
};

export const floatingAnimation = (element: HTMLElement, duration = 2000) => {
  anime({
    targets: element,
    translateY: ['-10px', '10px'],
    direction: 'alternate',
    loop: true,
    duration,
    easing: 'easeInOutSine'
  });
};

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};