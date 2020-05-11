// Módulos
let express = require('express');
let app = express();

// Logger para registrar la actividad
const log4js = require('log4js');
// configuración del logger
log4js.configure({
    appenders: {
        console: {type: 'console'}
    },
    categories: {
        default: {appenders: ['console'], level: 'trace'}
    }
});
const logger = log4js.getLogger('logger');

// Cabeceras
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});

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
                logger.error("Intento de acceso al servicio web con token inválido o caducado");
                res.json({acceso: false, error: 'Token invalido o caducado'});
                return;
            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                logger.info(`El usuario ${res.usuario} accedió a ${getUrl(req)}`);
                next();
            }
        });
    } else {
        res.status(403); // Forbidden
        logger.error("Intento de acceso al servicio web sin Token");
        res.json({acceso: false, mensaje: 'No hay Token'});
    }
});

// Aplicar routerUsuarioToken
app.use('/api/usuario', routerUsuarioToken);
app.use('/api/friends', routerUsuarioToken);
app.use('/api/mensaje', routerUsuarioToken);
app.use('/api/chat/:otherUser', routerUsuarioToken);
app.use('/api/chat/leer/:idMensaje', routerUsuarioToken);

// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function (req, res, next) {
    //console.log("routerUsuarioSession");
    if (req.session.usuario) {
        // dejamos correr la petición
        logger.info(`El usuario ${req.session.usuario} accedió a ${getUrl(req)}`);
        next();
    } else {
        logger.error(`Intento de acceso a ${getUrl(req)} sin autenticación`);
        logger.warn(`Redirección al formulario de login`);
        res.redirect("/identificarse");
    }
});

//Aplicar routerUsuarioSession
app.use("/listaUsuarios", routerUsuarioSession);
app.use("/usuario/friendRequest", routerUsuarioSession);
app.use("/listFriendRequests", routerUsuarioSession);

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
require("./routes/rpeticiones.js")(app, swig, gestorBD);
require("./routes/rapiLogUsuarios.js")(app, gestorBD);
require("./routes/rapiApp.js")(app, gestorBD);

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

let getUrl = (req) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
};
