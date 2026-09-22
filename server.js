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

app.use(cors())

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash')
        .from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            bcrypt.compare(req.body.password, data[0].hash)
                .then(isValid => {
                    if (isValid) {
                        return db.select('*')
                            .from('users')
                            .where('email', '=', req.body.email)
                            .then(user => {
                                res.json(user[0]);
                            })
                            .catch(err =>
                                res.status(400).json('Unable to get user')
                            );
                    } else {
                        res.status(400).json('Wrong credentials');
                    }
                })
                .catch(err => {
                    res.status(400).json('Wrong credentials');
                });
        })
        .catch(err => {
            res.status(400).json('Wrong credentials');
        });
});

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    db.transaction(trx => {
        return trx('login')
            .insert({
                hash: hash,
                email: email
            })
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    });
            });
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json('Unable to register');
    });
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
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