const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const postgres = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'felixlie',
    password: '',
    database: 'smart-brain',
  },
});

console.log(postgres.select("*").from('users'));

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '1234',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }

    ]
}
app.use(cors())

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    if (req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password){
            res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            console.log(hash);
        });
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(404).json('no such user');
    }
})

app.put('/image', (req,res) => {
    console.log('Image Body: ', req.body);
    const { id } = req.body;
    let found = false
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(404).json('not such user');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})


/* 

/ --> res = this is working
/signin --> POST = success or fail
/register --> POST = user
/profile/:userId -> GET = user
/image --> PUT --> user 

*/