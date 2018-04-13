const Sequelize = require('sequelize');
const encryption = require('../utilities/encryption');

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

    User.prototype.authenticate = (password) =>
    {
        const inputPasswordHash = encryption.hashPassword(password, this.salt);
        return inputPasswordHash === this.passwordHash;
    };

    return User;
};