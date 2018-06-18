const koa = require('koa');
const kcors = require('kcors');
const fetchMiddleware = require('../server/fetch.js');

init();

function prepareMiddlewares(app) {
    app.use(fetchMiddleware);
    app.use(kcors({
        credentials: true
    }));
    app.use(function*(next) {
        const api = require('../server' + this.path);
        yield api.call(this, next);
    });
}
function prepareSocketIO(app) {
    const socket = {
        emit: jest.fn()
    };
    const io = {
        sockets: {
            in: jest.fn().mockReturnValue(socket)
        }
    };

    app.io = io;
    app.mockSocket = socket; // for testing
}
function init() {
    global.app = koa();
    prepareMiddlewares(app);
    prepareSocketIO(app);

    jest.setTimeout(global.retryLimit * 5000);
}
