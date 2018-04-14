const User = require('../models').User;
const encryption = require('../utilities/encryption');

module.exports = {
    details: (request, response) =>
    {
        const id = request.params.id;
        User
            .findById(id)
            .then(user =>
            {
                response.render('user/details', user.dataValues);
            })
    },

    loginGet: (request, response) =>
    {
        response.render('user/login');
    },

    loginPost: (request, response) =>
    {
        const { email, password } = request.body;
        // console.log('\n---\n' + JSON.stringify(request.body) + '\n--\n');
        User
            .findOne({ where: { email } })
            .then(user =>
            {
                if (!user || !user.authenticate(password))
                {
                    const error = 'Either username or password is invalid!';
                    response.render('user/login', { email, error });
                    return;
                }

                request.logIn(user, (err) =>
                {
                    if (err)
                    {
                        response.redirect('/user/login', { error: err.message });
                        return;
                    }

                    response.redirect('/');
                })
            })
    },

    logout: (request, response) =>
    {
        request.logOut();
        response.redirect('/');
    },

    registerGet: (request, response) =>
    {
        response.render('user/register');
    },

    registerPost: (request, response) =>
    {
        const { fullName, email, password, repeatedPassword } = request.body;

        User
            .findOne({ where: { email: email } })
            .then(user =>
            {
                let errorMessage = '';
                if (user)
                {
                    errorMessage = 'Username present in database';
                }
                else if (password !== repeatedPassword)
                {
                    errorMessage = 'Mismatched passwords'
                }

                if (errorMessage)
                {
                    response.render('user/register', { fullName, email, error: errorMessage });
                }
                else
                {
                    const salt = encryption.generateSalt();
                    const passwordHash = encryption.hashPassword(password, salt);

                    const newUser = {
                        email,
                        passwordHash,
                        fullName,
                        salt
                    };

                    User
                        .create(newUser)
                        .then(user =>
                        {
                            request.logIn(user, err =>
                            {
                                if (err)
                                {
                                    response.render('user/register', { fullName, email, error: err.message })
                                    // return;
                                }
                                else
                                {
                                    response.redirect('/');
                                }
                            });
                        })
                }
            })
    }
};