// D:\ene\test-server.js
import express from 'express';
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.post('/api/send-verification', (req, res) => {
  console.log("📧 Email recibido:", req.body.email);
  res.json({ success: true, message: 'Test OK' });
});

app.listen(3001, () => {
  console.log('🔍 TEST Server ES Module en http://localhost:3001');
});