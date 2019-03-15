const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// connect this server to database
const db = knex({
  client: 'pg',
  connection: {
    // heroku psql connection
    connectionString: process.env.DATABASE_URL,
    ssl: true
    // local dev
    // host : '127.0.0.1',
    // user : 'jcgentr',
    // password : '',
    // database : 'smart-brain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// routes
// ROOT
app.get('/', (req, res) => {
    res.send('IT IS WORKING!');
});

/* endpoints
/signin => POST, res: success/fail
/register => POST, res: user object
/profile/:userId => GET, res: user object
/image => PUT, res: user
*/

// send sensitive info over HTTPS POST and hash/encrypt passwords
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
// more advanced way of writing these routes
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
// use PUT request for updates
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleAPIcall(req, res) });

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


