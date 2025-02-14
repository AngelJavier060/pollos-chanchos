export const initializePushNotifications = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al inicializar notificaciones:', error);
    return false;
  }
};

export const showPushNotification = (title: string, options: NotificationOptions) => {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}; 