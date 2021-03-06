const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
    index: (request, response) =>
    {
        Article
            .findAll({ limit: 6, include: [{ model: User }] })
            .then(articles =>
            {
                response.render('home/index', { articles });
            });
    }
};