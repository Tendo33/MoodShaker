import { ref, onMounted, onUnmounted } from 'vue'

interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export function useBreakpoints() {
  // 默认值，在SSR环境中使用
  const windowWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  const breakpoints: Breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };
  
  const isMobile = ref<boolean>(windowWidth.value < breakpoints.md);
  const isTablet = ref<boolean>(windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg);
  const isDesktop = ref<boolean>(windowWidth.value >= breakpoints.lg);
  
  const updateWidth = (): void => {
    if (typeof window === 'undefined') return;
    
    windowWidth.value = window.innerWidth;
    isMobile.value = windowWidth.value < breakpoints.md;
    isTablet.value = windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg;
    isDesktop.value = windowWidth.value >= breakpoints.lg;
  };
  
  onMounted(() => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('resize', updateWidth);
    updateWidth();
  });
  
  onUnmounted(() => {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('resize', updateWidth);
  });
  
  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints
  };
}