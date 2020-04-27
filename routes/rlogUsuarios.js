module.exports = function (app, swig, gestorBD) {
    /**
     * GET registro de usuarios
     */
    app.get("/registrarse", function (req, res) {
        let respuesta = swig.renderFile('views/bregistro.html', {});
        res.send(respuesta);
    });

    /**
     * POST registro de usuarios
     */
    app.post('/usuario', function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let usuario = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: seguro
        };
        gestorBD.insertarUsuario(usuario, function (id) {
            if (id == null) {
                res.redirect("/registrarse?mensaje=Error al registrar usuario&tipoMensaje=alert-danger");
            } else {
                res.redirect("/identificarse?mensaje=Nuevo usuario registrado&tipoMensaje=alert-success");
            }
        });
    });

    /**
     * GET identificación de usuarios (login)
     */
    app.get("/identificarse", function (req, res) {
        let respuesta = swig.renderFile('views/bidentificacion.html', {});
        res.send(respuesta);
    });

    /**
     * POST identificación de usuarios (login)
     */
    app.post("/identificarse", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/listaUsuarios");
            }
        });
    });

    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.send("Usuario desconectado");
    });
};