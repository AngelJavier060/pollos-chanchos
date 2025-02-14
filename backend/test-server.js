const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { usuario, password } = req.body;
  console.log('Login attempt:', { usuario });

  if (usuario === 'admintest' && password === '12345') {
    res.json({
      token: 'test-token',
      user: {
        id: 1,
        nombre: 'Admin',
        apellido: 'Test',
        usuario: 'admintest',
        rol: 'ADMIN'
      }
    });
  } else {
    res.status(401).json({
      message: usuario ? 'La contraseña ingresada es incorrecta' : 'El usuario ingresado no existe'
    });
  }
});

// Mock forgot-password endpoint
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  console.log('Password recovery attempt:', { email });

  res.json({
    message: 'Si el correo existe en nuestro sistema, recibirá instrucciones para restablecer su contraseña'
  });
});

app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
});
