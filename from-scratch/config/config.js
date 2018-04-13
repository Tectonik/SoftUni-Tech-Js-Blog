const path = require('path');

module.exports = {
    rootFolder: path.normalize(path.join(__dirname, '/../')),
    database:
    {
        "development":
        {
            "username": "root",
            "password": null,
            "database": "database_development",
            "host": "127.0.0.1",
            "dialect": "mysql"
        }
    }
};