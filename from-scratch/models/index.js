const fileSystem = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`).database[environment];
const database = {};

let sequelize
if (config.use_env_variable)
{
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
}
else
{
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fileSystem
    .readdirSync(__dirname)
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js')
    )
    .forEach(file =>
    {
        const model = sequelize['import'](path.join(__dirname, file));
        database[model.name] = model;
    });

Object.keys(database).forEach(modelName =>
{
    if (database[modelName].associate)
    {
        database[modelName].associate(database);
    }
});

const models = Object.keys(database);

async function create(models)
{
    console.log('Initializing... Now');
    await sequelize
        .authenticate()
        .then((error) =>
        {
            console.log('\x1b[32,%s\x1b[0,', 'Connection initialized successfully...');
        })
        .catch((error) =>
        {
            console.log('Database connection unsuccessful!');
            process.exit(1);
        });

    for (let i = 0; i < models.length; ++i)
    {
        const modelName = models[i];

        try
        {
            await database[modelName].sync();
            models.splice(i, 1);
            i--;
        }
        catch (error)
        {

        }
    }

    if (models.length > 0)
    {
        create(models.slice());
    }
}

create(models.slice());

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;