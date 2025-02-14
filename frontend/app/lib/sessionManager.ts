export const setupSessionManager = () => {
  let inactivityTimer: NodeJS.Timeout;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      authService.logout();
    }, 30 * 60 * 1000); // 30 minutos
  };

  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);
  
  resetTimer();
}; 