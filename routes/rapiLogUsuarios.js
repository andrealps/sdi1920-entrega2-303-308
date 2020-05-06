module.exports = function (app, gestorBD) {

    app.get("/api/usuario", function (req, res) {
        gestorBD.obtenerUsuarios({}, function (usuarios) {
            if (usuarios == null) {
                res.status(500);
                res.json({error: "se ha producido un error"})
            } else {
                res.status(200);
                res.send(JSON.stringify(usuarios));
            }
        });
    });

    /**
     * S1 - Identificarse con usuario – token
     */
    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        };

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.status(401);
                res.json({
                    autenticado: false
                })
            } else {
                var token = app.get('jwt').sign({usuario: criterio.email, tiempo: Date.now() / 1000}, "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token: token
                })
            }
        });
    });

    /**
     * S3 - Usuario identificado: Crear un mensaje
     */
    app.post("/api/mensaje", function (req, res) {
        // Buscamos la amistad en la base de datos
        let criterio = {
            $or: [
                {usuario1: res.usuario, usuario2: req.body.userTo},
                {usuario1: req.body.userTo, usuario2: res.usuario}
            ]
        };
        // Comprobamos que son amigos
        gestorBD.obtenerAmistades(criterio, function (friends) {
            if (friends == null || friends.length === 0) {
                res.status(500);
                res.json({
                    error: "Error, no eres amigo del usuario " + req.body.userTo
                })
            } else {
                // Creamos el mensaje y lo insertamos en el chat
                var mensaje = {
                    emisor: res.usuario,
                    texto: req.body.texto,
                    fecha: Date.now(),
                    leido: false
                };
                criterio = {"_id": friends[0]._id};
                gestorBD.insertarMensaje(criterio, mensaje, function (result) {
                    res.status(200);
                    res.json({
                        mensaje: "Mensaje insertado"
                    })
                })
            }
        });
    });
};
