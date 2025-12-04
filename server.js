// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('projects/demo-app/db.json'); // Adjust path to your db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/auth/login', (req, res) => {
	const { username, password } = req.body;
	console.log('Login attempt:', username, password);

	if (username === 'admin@admin.com' && password === 'admin') {
		res.json({
			token: 'fake-jwt-token-123456',
			user: {
				id: 1,
				name: 'Mika Admin',
				role: 'admin',
				avatar: 'https://i.pravatar.cc/150?u=1'
			}
		});
	} else {
		res.status(401).json({ error: 'Invalid credentials. Try admin/admin' });
	}
});

server.use(router);

server.listen(3007, () => {
	console.log('🚀 Mika Demo API is running on http://localhost:3007');
});
