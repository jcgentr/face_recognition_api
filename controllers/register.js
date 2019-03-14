const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body;
    // validate
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    // update login table with hashed password
    // synchronous (need to change to async for my project)
    const hash = bcrypt.hashSync(password);

    // make transaction with knex b/c updating two tables
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            // update users table
            return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                }).then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'));
};

module.exports = {
    handleRegister: handleRegister
};