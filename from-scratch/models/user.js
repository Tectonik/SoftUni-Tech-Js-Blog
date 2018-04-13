const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    const User = sequelize.define('User',
    {
        email:
        {
            type: Sequelize.STRING,
            required: true,
            unique: true,
            allowNull: false
        },
        passwordHash:
        {
            type: Sequelize.STRING,
            required: true
        },
        fullName:
        {
            type: Sequelize.STRING,
            required: true
        },
        salt:
        {
            type: Sequelize.STRING,
            required: true
        }
    });

    return User;
};