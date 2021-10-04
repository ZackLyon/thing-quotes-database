const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/categories', async(req, res) => {
  try {
    const data = await client.query('SELECT * from categories');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/thingQuotes', async(req, res) => {
  try {
    const data = await client.query('SELECT tq.id, tq.name, c.role, tq.quote, tq.known_thing, tq.outpost FROM thing_quotes AS tq INNER JOIN categories AS c ON tq.role_id = c.id');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/thingQuotes/:id', async(req, res) => {
  const quoteData = await client.query('SELECT tq.id, tq.name, c.role, tq.quote, tq.known_thing, tq.outpost FROM thing_quotes AS tq INNER JOIN categories AS c ON tq.role_id = c.id WHERE tq.id = $1', [req.params.id]);
  res.json(quoteData.rows[0]);
});

app.post('/thingQuotes', async(req, res) => {
  try {
    const data = await client.query(
      'INSERT INTO thing_quotes(name, role_id, quote, known_thing, outpost)VALUES ($1, $2, $3, $4, $5) RETURNING *;', 
      [req.body.name, req.body.role_id, req.body.quote, req.body.known_thing, '31']);

    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.put('/thingQuotes/:id', async(req, res) => {
  const quoteData = await client.query('UPDATE thing_quotes SET name =$1, role_id=$2, quote=$3, known_thing=$4, outpost=$5 WHERE id = $6 RETURNING *', [req.body.name, req.body.role_id, req.body.quote, req.body.known_thing, '31', req.params.id]);
  res.json(quoteData.rows[0]);
});

app.delete('/thingQuotes/:id', async(req, res) => {
  try {
    const quoteData = await client.query('DELETE FROM thing_quotes WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(quoteData.rows[0]);
  } catch(e) {
      
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
