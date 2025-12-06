const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// 🛠️ Dynamic Configuration from Command Line Args
// Usage: node server.js <port> <db-file>
const port = process.argv[2] || 3000;
const dbFile = process.argv[3] || 'projects/demo-app/db.json';

console.log(`📂 Loading Database: ${dbFile}`);
const router = jsonServer.router(dbFile);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// 🔐 CUSTOM LOGIN ROUTE
server.post(['/login', '/auth/login'], (req, res) => {
  const { username, password } = req.body;

  // Accept 'admin' or 'manager' for the bookstore demo
  if ((username === 'admin@admin.com' || username === 'manager') && password === 'admin') {
    res.json({
      token: `fake-jwt-token-${port}`, // Different token per tenant
      user: {
        id: 1,
        name: username === 'manager' ? 'Store Manager' : 'Mika Admin',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=1'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

server.use(router);

server.listen(port, () => {
  console.log(`🚀 Mika API running at http://localhost:${port}`);
});
