const usersRouter = require('./users');
const rolesRouter = require('./roles');
const itemsRouter = require('./items');
const productsRouter = require('./products');
const publishRouter = require('./publish');
const massagesRouter = require('./massages');
const commentsRouter = require('./comments');

module.exports = {
    usersRouter,
    rolesRouter,
    itemsRouter,
    productsRouter,
    publishRouter,
    massagesRouter,
    commentsRouter
};