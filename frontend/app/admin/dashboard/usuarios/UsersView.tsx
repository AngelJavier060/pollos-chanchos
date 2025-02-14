const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token disponible:', !!token); // Verifica si hay token
    
    const response = await api.get('/api/usuarios');
    console.log('Respuesta:', response);
    setUsers(response);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    toast({
      title: "Error",
      description: "No se pudieron cargar los usuarios",
      variant: "destructive",
    });
  }
}; 