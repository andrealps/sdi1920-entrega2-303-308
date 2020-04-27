// Módulos
let express = require('express');
let app = express();

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@mysocialnetwork-shard-00-00-7kwvz.mongodb.net:27017,mysocialnetwork-shard-00-01-7kwvz.mongodb.net:27017,mysocialnetwork-shard-00-02-7kwvz.mongodb.net:27017/test?ssl=true&replicaSet=MySocialNetwork-shard-0&authSource=admin&retryWrites=true&w=majority');

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, mongo);
