const express = require('express');
const app = express();
const chalk = require('chalk');
const nunjucks = require('nunjucks');
const path = require('path');
const routes = require('./routes');
const bodyParser = require('body-parser');
const socketio = require('socket.io');

// Define server port
const port = process.env.APP_SERVER_PORT || 3000;

// Configure Nunjucks
// root view: /views
let views = process.env.NODE_PATH ? process.env.NODE_PATH + '/views' : 'views';
nunjucks.configure(views, {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true
});

// Set Nunjucks as render engine for .html files
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Logger
app.use(function (req, res, next) {
    console.log(chalk.blue(`[twittin] ${req.method} ${req.url} ${req.path}`));
    next();
});

// server needs app
const server = app.listen(3000, function () {
    console.log(chalk.blue(`[twittin] Server started on port ${port}...`));
});
// socket.io needs server
const io = socketio.listen(server);

// app needs routes & routes needs socket.io
app.use('/', routes(io));

// define public
app.use(express.static('public'));

