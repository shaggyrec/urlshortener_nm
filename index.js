const http = require('http');
const static = require('node-static');
const Router = require('node-router');
const mongo = require('./config/mongo');
const config = require('./config');
const controllers = require('./controllers');

mongo.connect();

const router = Router();
const route = router.push;

const fileServer = new static.Server('./public');

route('POST','/api/shorten', controllers.insertUrl);
route('GET',':code', controllers.gettUrl);

route('*', async (req, res, next) => {
    await fileServer.serve(req, res, async (e, res) => {
        if (e && (e.status === 404)) {
            await next();
        }
    });
})

const server = http.createServer(router);

server.listen(config.app.port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${config.app.port}`);
});