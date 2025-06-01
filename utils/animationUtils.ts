/**
 * Utilidades para animaciones y efectos visuales
 * Proporciona funciones para manejar animaciones basadas en scroll y otros efectos visuales
 */

/**
 * Inicializa las animaciones basadas en scroll para elementos con la clase 'reveal-on-scroll'
 * Los elementos se revelarán cuando entren en el viewport
 */
export const initScrollAnimations = (): void => {
  // Opciones para el Intersection Observer
  const options = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // El elemento debe estar al menos 15% visible
  };

  // Callback que se ejecuta cuando un elemento entra/sale del viewport
  const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
    entries.forEach(entry => {
      // Si el elemento es visible
      if (entry.isIntersecting) {
        // Añadir la clase 'revealed' para activar la animación
        entry.target.classList.add('revealed');
        // Dejar de observar el elemento una vez que se ha revelado
        observer.unobserve(entry.target);
      }
    });
  };

  // Crear el observer
  const observer = new IntersectionObserver(handleIntersect, options);

  // Seleccionar todos los elementos con la clase 'reveal-on-scroll'
  const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
  
  // Observar cada elemento
  elementsToReveal.forEach(element => {
    // Asegurarse de que el elemento no tenga ya la clase 'revealed'
    element.classList.remove('revealed');
    observer.observe(element);
  });
};

/**
 * Aplica un efecto de desvanecimiento a elementos cuando se hace scroll
 * @param elementSelector - Selector CSS para los elementos a los que aplicar el efecto
 * @param startOpacity - Opacidad inicial (0-1)
 * @param endOpacity - Opacidad final (0-1)
 */
export const applyScrollFadeEffect = (
  elementSelector: string,
  startOpacity: number = 1,
  endOpacity: number = 0
): void => {
  const elements = document.querySelectorAll(elementSelector);
  
  const handleScroll = (): void => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const el = element as HTMLElement;
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      
      // Calcular la posición relativa del elemento respecto al scroll
      const distanceFromTop = scrollTop - elementTop;
      const elementHeight = rect.height;
      
      // Calcular el porcentaje de scroll a través del elemento
      let scrollPercentage = distanceFromTop / (elementHeight + windowHeight);
      scrollPercentage = Math.max(0, Math.min(1, scrollPercentage));
      
      // Calcular la opacidad basada en el porcentaje de scroll
      const opacity = startOpacity - (scrollPercentage * (startOpacity - endOpacity));
      
      // Aplicar la opacidad
      el.style.opacity = opacity.toString();
    });
  };
  
  // Añadir el evento de scroll
  window.addEventListener('scroll', handleScroll);
  
  // Ejecutar una vez para establecer los valores iniciales
  handleScroll();
};

/**
 * Aplica un efecto de parallax a elementos de fondo
 * @param elementSelector - Selector CSS para los elementos a los que aplicar el efecto
 * @param speed - Velocidad del efecto parallax (1 = normal, <1 = más lento, >1 = más rápido)
 */
export const applyParallaxEffect = (
  elementSelector: string,
  speed: number = 0.5
): void => {
  const elements = document.querySelectorAll(elementSelector);
  
  const handleScroll = (): void => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    elements.forEach(element => {
      const el = element as HTMLElement;
      // Calcular el desplazamiento basado en la posición de scroll
      const offset = scrollTop * speed;
      
      // Aplicar la transformación
      el.style.transform = `translateY(${offset}px)`;
    });
  };
  
  // Añadir el evento de scroll
  window.addEventListener('scroll', handleScroll);
  
  // Ejecutar una vez para establecer los valores iniciales
  handleScroll();
};

/**
 * Aplica un efecto de neón pulsante a elementos
 * @param elementSelector - Selector CSS para los elementos a los que aplicar el efecto
 * @param color - Color base del efecto neón (ej. '#00ffff')
 * @param intensity - Intensidad del efecto (0-1)
 */
export const applyNeonPulseEffect = (
  elementSelector: string,
  color: string = '#00ffff',
  intensity: number = 0.5
): void => {
  const elements = document.querySelectorAll(elementSelector);
  
  elements.forEach(element => {
    const el = element as HTMLElement;
    
    // Convertir el color a formato rgba para poder ajustar la opacidad
    let r = 0, g = 0, b = 0;
    
    // Parsear el color hexadecimal
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    }
    
    // Aplicar el efecto neón
    el.style.boxShadow = `
      0 0 5px rgba(${r}, ${g}, ${b}, ${0.2 * intensity}),
      0 0 10px rgba(${r}, ${g}, ${b}, ${0.1 * intensity}),
      0 0 15px rgba(${r}, ${g}, ${b}, ${0.05 * intensity})
    `;
    
    // Añadir una transición suave
    el.style.transition = 'box-shadow 1s ease-in-out';
    
    // Crear la animación de pulso
    let growing = true;
    const animate = () => {
      const currentIntensity = growing ? intensity * 1.5 : intensity * 0.8;
      
      el.style.boxShadow = `
        0 0 5px rgba(${r}, ${g}, ${b}, ${0.2 * currentIntensity}),
        0 0 10px rgba(${r}, ${g}, ${b}, ${0.1 * currentIntensity}),
        0 0 15px rgba(${r}, ${g}, ${b}, ${0.05 * currentIntensity})
      `;
      
      growing = !growing;
      setTimeout(animate, 1500);
    };
    
    // Iniciar la animación
    animate();
  });
};
