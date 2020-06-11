const express = require('express');
const path = require('path');

let app = express();

app.use(express.static('game'));
app.use(express.static('bower_components'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000);