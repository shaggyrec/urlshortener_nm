const mongo = require('../config/mongo');
const shortener = require('../lib/shortener');

module.exports.insertUrl = async (req, res, next) => {
    if (req.method == 'POST') {
        const params = await new Promise((resolve, reject) => {
            let jsonString = '';
            req.on('data', (data) => {
                jsonString += data;
            });
            req.on('end', () => {
                resolve(JSON.parse(jsonString));
            });

        });
        const url = params.url;
        const existsUrl = await mongo.urls.findOne({'url': url});
        if(existsUrl) {
            res.end(existsUrl.code);
            return;
        }
        const index =  await mongo.urls.countDocuments();
        const newUrl = {
            url,
            code: shortener.encode(index)
        }
        await mongo.urls.insertOne(newUrl);
        res.end(newUrl.code);
    }
    await next();
}

module.exports.gettUrl = async (req, res, next) => {
    const code = req.url.substr(1);
    const redirectUrl = await mongo.urls.findOne({'code': code});
    if(redirectUrl){
        res.writeHead(302, {
            'Location': redirectUrl.url
        });
        res.end();
        return;
    }
    await next();
};