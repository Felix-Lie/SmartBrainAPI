const handleRegister = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleRegister: handleRegister
}   