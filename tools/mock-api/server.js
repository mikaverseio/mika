/**
 * Lightweight JSON Server bootstrapper for local demo APIs.
 * Usage:
 *   node tools/mock-api/server.js <port> <db-file>
 *
 * Example:
 *   node tools/mock-api/server.js 3000 tools/mock-api/db-demo1.json
 */
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const port = process.argv[2] || 3000;
const dbFile = process.argv[3] || path.join(__dirname, 'db-demo1.json');

console.log(`📂 Loading Database: ${dbFile}`);
const router = jsonServer.router(dbFile);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Simple auth endpoint stub
server.post(['/login', '/auth/login'], (req, res) => {
  const { username, password } = req.body;
  if ((username === 'admin@admin.com' || username === 'manager') && password === 'admin') {
    res.json({
      token: `fake-jwt-token-${port}`,
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

// Pass everything else to json-server
server.use(router);

server.listen(port, () => {
  console.log(`🚀 Mika API running at http://localhost:${port}`);
});
