const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

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

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email &&
       req.body.password === database.users[0].password) {
        res.json("SUCCESSful Signin");
    } else {
        res.status(400).json("error signing in");
    }
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
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