const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
    createGet: function(request, response)
    {
        response.render('article/create');
    },
    createPost: function(request, response)
    {
        const articleParameters = request.body;

        let errorMessage = '';

        if (!request.isAuthenticated)
        {
            errorMessage = 'Not logged, you are';
        }
        else if (!articleParameters.title)
        {
            errorMessage = 'No title'
        }
        else if (!articleParameters.content)
        {
            errorMessage = 'No content'
        }

        if (errorMessage)
        {
            response.render('/article/create', { error: errorMessage });
        }

        articleParameters.authorId = request.user.id;

        Article.create(articleParameters)
            .then(
                article =>
                {
                    response.redirect('/');
                },
                (error) =>
                {
                    console.log(error.message);
                    response.render('/article/create', { error: error.message });
                })
    },
    detailsGet: (request, response) =>
    {
        const id = request.params.id;
        Article
            .findById(id, { include: [{ model: User }] })
            .then(
                article =>
                {
                    response.render('article/details', article.dataValues);
                })
    }
};