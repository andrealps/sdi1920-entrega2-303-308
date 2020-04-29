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
        // Comprobamos que las contraseñas coincidan
        if (req.body.password != req.body.passwordConfirm) {
            res.redirect("/registrarse?mensaje=Las contraseñas no coinciden&tipoMensaje=alert-danger");
        } else {
            // Comprobamos que el email no se encuentre registrado
            let criterio = {
                email: req.body.email
            };
            gestorBD.obtenerUsuarios(criterio, function (usuario) {
                if (usuario.length != 0) {
                    res.redirect("/registrarse?mensaje=El email ya está en uso&tipoMensaje=alert-danger");
                } else {
                    // Encriptación de la contraseña
                    let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                        .update(req.body.password).digest('hex');
                    // Creamos el usuario que meteremos en la BD
                    let usuario = {
                        nombre: req.body.nombre,
                        apellidos: req.body.apellidos,
                        email: req.body.email,
                        password: seguro
                    };
                    // Insertamos el usuario
                    gestorBD.insertarUsuario(usuario, function (id) {
                        if (id == null) {
                            res.redirect("/registrarse?mensaje=Error al registrar usuario&tipoMensaje=alert-danger");
                        } else {
                            res.redirect("/identificarse?mensaje=Nuevo usuario registrado&tipoMensaje=alert-success");
                        }
                    });
                }
            });
        }
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
        res.send(app.renderView("views/bidentificacion.html", req.session))
    });
};