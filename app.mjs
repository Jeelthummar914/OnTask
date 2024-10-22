import http from 'http';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Database Connection
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID', connection.threadId);
});

//to verify connection with the Database 
connection.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Query error:', err.stack);
  } else {
    console.log('Query results:', results);
  }
});

// Server Setup
const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log('server is online');

  // Static Routes
  if (req.url === '/' || req.url === '/index.html') {
    serveFile(res, 'index.html');
  } else if (req.url === '/dashboard.html') {
    serveFile(res, 'dashboard.html');
  } else if (req.url === '/inbox.html') {
    serveFile(res, 'inbox.html');
  }
  // Dynamic Route
  else if (req.url.startsWith('/user/')) {
    const username = req.url.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Welcome, ${username}!</h1>`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

function serveFile(res, filename) {
  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

connection.end();
