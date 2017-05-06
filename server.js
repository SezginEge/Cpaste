'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var memcache = require('memory-cache');
var randomString = require('randomstring');
var bodyParser = require("body-parser");
var RateLimit = require('express-rate-limit');
var cors = require('cors');
var ua = require('universal-analytics');

var port = process.env.port || 1337;
var visitor = ua('UA-53768957-2', {https:true});

app.enable('trust proxy');

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');

const views = __dirname + "/views/";
const expirationTime = 5 * 1000 * 60;

app.set('views', views);

app.options('*', cors())

app.all('/new',function(req, res, next){
    var uaPlatform = req.headers["UA-Platform"];
    var type = req.header["Type"];

    visitor.event("New", type, uaPlatform).send();
});

http.listen(port, function () {
    console.log('listening on *:' + port);
    console.log("Views path: " + views);
});

var readLimiter = new RateLimit({
    windowMs: 5 * 60 * 1000,
    delayAfter: 50,
    delayMs: 2 * 1000,
    max: 100,
    message: "Too many read operation. You can read a hundred times in 5 minute"
});

var createLimiter = new RateLimit({
    windowMs: 5 * 60 * 1000,
    delayAfter: 3,
    max: 10,
    delayMs: 1 * 1000,
    message: "You can create only 10 cpaste item in 5 minute"
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get("/:id", readLimiter, function (req, res) {
    var id = req.params.id;

    var text = memcache.get(id);
    if (text) {
        return res.render("index", {
            exist: true,
            data: text,
            code: id
        })
    }
    else {
        return res.redirect("/");
    }
});


app.post("/new", createLimiter, function (req, res) {
    var text = req.body.text;

    if (text.length == 0) {
        return res.json(400, {
            message: "Text cannot be empty"
        });
    }

    var id = randomString.generate({
        length: 6
    });

    memcache.put(id, text, expirationTime);
    return res.json({
        id: id,
    });
});

