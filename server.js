const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = { // updates do not persist if server restarts
    users: [
        {
            id: '123',
            name: 'Jane',
            email: 'jane@mail.com',
            password: 'pizza',
            entries: 0,
            joined: new Date()
        },
        {
            id: '234',
            name: 'Ron',
            email: 'ron@mail.com',
            password: 'taco',
            entries: 0,
            joined: new Date()
        }
    ]
}

// routes
// ROOT
app.get('/', (req, res) => {
    res.send(database.users);
});

/* endpoints
/signin => POST, res: success/fail
/register => POST, res: user object
/profile/:userId => GET, res: user object
/image => PUT, res: user
*/

// send sensitive info over HTTPS POST and hash/encrypt passwords
app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    // bcrypt.compare("soccer", "$2a$10$iVefifwaCH/lcbhm6SS5EuDVpqqsgHOH.C3joU0ZAsXL5O3sozALe", function(err, res) {
    //     console.log('correct password:', res);
    // });
    // bcrypt.compare("veggies", "$2a$10$iVefifwaCH/lcbhm6SS5EuDVpqqsgHOH.C3joU0ZAsXL5O3sozALe", function(err, res) {
    //     console.log('wrong password:', res);
    // });
    // only checking first user right now
    if(req.body.email === database.users[0].email && 
       req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json("error signing in");
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: '777',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let isFound = false;
    database.users.forEach(user => {
        if(user.id === id) {
            isFound = true;
            return res.json(user);
        }
    });
    if(!isFound) {
        res.status(404).json("No such user found");
    }
});
// use PUT request for updates
app.put('/image', (req, res) => {
    const { id } = req.body;
    let isFound = false;
    database.users.forEach(user => {
        if(user.id === id) {
            isFound = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if(!isFound) {
        res.status(404).json("No such user found");
    }
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});