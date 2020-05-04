// Módulos
let express = require('express');
let app = express();

// Token
var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

// Seguridad
let fs = require('fs');
let https = require('https');

// Sesión
let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

// Encriptación
let crypto = require('crypto');
// MongoDB
let mongo = require('mongodb');
// Swig
let swig = require('swig');
// Acceso de parámetros en body
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Gestor de la BD
let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function (req, res, next) {
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.tiempo) > 240) {
                res.status(403); // Forbidden
                res.json({acceso: false, error: 'Token invalido o caducado'});
                return;
            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        res.json({acceso: false, mensaje: 'No hay Token'});
    }
});

// Aplicar routerUsuarioToken
app.use('/api/usuario', routerUsuarioToken);

// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : " + req.session.destino);
        res.redirect("/identificarse");
    }
});

//Aplicar routerUsuarioSession
app.use("/listaUsuarios", routerUsuarioSession);

// Declaración del directorio public como estático
app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@mysocialnetwork-shard-00-00-7kwvz.mongodb.net:27017,mysocialnetwork-shard-00-01-7kwvz.mongodb.net:27017,mysocialnetwork-shard-00-02-7kwvz.mongodb.net:27017/test?ssl=true&replicaSet=MySocialNetwork-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rlogUsuarios")(app, swig, gestorBD);
require("./routes/rdatosPruebas")(app, swig, gestorBD);
require("./routes/rapiLogUsuarios.js")(app, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/listaUsuarios');
});

// lanzar el servidor
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function () {
    console.log("Servidor activo");
});

// Renderiza las vistas pasándoles el usuario en sesión
app.renderView = (view, session, respuesta) => {
    respuesta = respuesta ? respuesta : {};
    respuesta.usuario = session.usuario;
    return swig.renderFile(view, respuesta);
};
