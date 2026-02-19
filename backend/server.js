const http = require('http');
const url = require('url');
const querystring = require('querystring');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Inicializar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

const PORT = process.env.PORT || 3001;

// Função auxiliar para adicionar headers CORS
function addCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
}

// Função auxiliar para parsear o corpo da requisição
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch (e) {
      callback(null);
    }
  });
}

// Criar servidor
const server = http.createServer((req, res) => {
  addCORSHeaders(res);

  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Rotas
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Servidor de Gestão Financeira ativo' }));
  } else if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  } else if (pathname === '/api/transactions' && req.method === 'GET') {
    // Buscar transações
    res.writeHead(200);
    res.end(JSON.stringify({ transactions: [] }));
  } else if (pathname === '/api/transactions' && req.method === 'POST') {
    // Criar transação
    parseBody(req, (data) => {
      res.writeHead(201);
      res.end(JSON.stringify({ message: 'Transação criada', data }));
    });
  } else if (pathname === '/api/categories' && req.method === 'GET') {
    // Buscar categorias
    res.writeHead(200);
    res.end(JSON.stringify({ categories: [] }));
  } else if (pathname === '/api/goals' && req.method === 'GET') {
    // Buscar metas
    res.writeHead(200);
    res.end(JSON.stringify({ goals: [] }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
