const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'felixlie',
    password: '',
    database: 'smart-brain',
  },
});

db.select("*").from('users').then(data => {
    console.log(data);
});

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
    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //         console.log(hash);
    //     });
    // });
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        console.log(user);
        if (user.length) {
            return res.json(user[0]);
        } else {
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('Error Getting User'))
})

app.put('/image', (req,res) => {
    console.log('Image Body: ', req.body);
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'))
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


// .then(entries => {
//     // If you are using knex.js version 1.0.0 or higher this now 
//     // returns an array of objects. Therefore, the code goes from:
//     // entries[0] --> this used to return the entries
//     // TO
//     // entries[0].entries --> this now returns the entries
//     res.json(entries[0].entries);
//   })