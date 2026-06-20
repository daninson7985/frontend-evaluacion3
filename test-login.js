// Simple test script that mirrors the mock login logic in authService.js
const mockUsers = [
  { id: 1, full_name: "Admin Prueba", email: "admin@sportclub.cl", password: "123456", role: "admin" },
  { id: 2, full_name: "Juan Pérez", email: "juan@mail.com", password: "juan123", role: "user" }
];

async function loginUser(credentials) {
  const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
  if (user) {
    return {
      ok: true,
      data: {
        token: `fake-jwt-token-${user.role}`,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
      }
    };
  }
  throw new Error('Credenciales inválidas');
}

(async () => {
  try {
    const res = await loginUser({ email: 'admin@sportclub.cl', password: '123456' });
    console.log('LOGIN OK:', res);
  } catch (err) {
    console.error('LOGIN ERR:', err.message);
  }

  try {
    const res2 = await loginUser({ email: 'juan@mail.com', password: 'wrong' });
    console.log('LOGIN OK 2:', res2);
  } catch (err) {
    console.error('LOGIN ERR 2 (expected):', err.message);
  }
})();