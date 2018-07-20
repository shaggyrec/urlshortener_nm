const mongodb = require('mongodb');
const connect = mongodb.connect;
const config = require('./index');


module.exports = mongodb;

mongodb.connect = async (ctx) => {
    if (mongodb.db) {
        await mongodb.db.close();
    }

    const db = mongodb.db = await connect(config.mongo.url,{ useNewUrlParser: true });

    mongodb.urls = db.db(config.mongo.dbname).collection('urls');
};