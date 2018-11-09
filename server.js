const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');
const dbConfig      = require('./config/db');

const app           = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
//Serve static files from current directory
app.use(express.static(__dirname));

MongoClient.connect(dbConfig.url, (err, database) => {
    if (err) return console.log(err);

    const db = database.db(dbConfig.name);
    require('./app/routes')(app, db);

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
});
