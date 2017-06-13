const express = require('express');
const router = express.Router();
const tweetBank = require('../tweetBank.js');
const path = require('path');

router.get('/', (req, res) => {
    let tweets = tweetBank.list();
    res.render('index', {tweets: tweets, showForm: true});
});

router.get('/users/:name?', function (req, res) {
    let name = req.params.name;
    let list = tweetBank.find({name: name});
    res.render('index', {tweets: list, name: name, showForm: true});
});

router.get('/tweets/:id', function (req, res) {
    let id = parseInt(req.params.id);
    let list = tweetBank.find({id: id});
    let name = list[0].name;
    res.render('index', {tweets: list, name: name, showForm: true});
});

router.post('/tweets', function (req, res) {
    let name = req.body.name;
    let text = req.body.text;
    tweetBank.add(name, text);
    res.redirect('/');
});

// module.exports = router;
module.exports = function (io) {
    io.sockets.emit('newTweet', {/* tweet info */});
    return router;
};
