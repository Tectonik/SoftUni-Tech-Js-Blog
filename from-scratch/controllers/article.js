const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
    createGet: (request, response) =>
    {
        response.render('article/create');
    },

    createPost: (request, response) =>
    {
        const { title, content } = request.body;

        let errorMessage = '';

        if (!request.isAuthenticated())
        {
            errorMessage = 'You need to be logged in to make articles!';
        }
        else if (!title)
        {
            errorMessage = 'Invalid title';
        }
        else if (!content)
        {
            errorMessage = 'invalid content';
        }

        if (errorMessage)
        {
            response.render('article/create', { title, content, error: errorMessage });
        }
        else
        {
            Article
                .create({ title, content, authorId: request.user.id })
                .then(article =>
                {
                    response.redirect('/');
                })
                .catch(err =>
                {
                    console.log(err.message);
                    response.render('article/create', { title, content, error: err.message });
                });
        }
    },

    details: (request, response) =>
    {
        const id = request.params.id;
        Article
            .findById(id, { include: [{ model: User }] })
            .then(article =>
            {
                response.render('article/details', article.dataValues);
            })
    }
};