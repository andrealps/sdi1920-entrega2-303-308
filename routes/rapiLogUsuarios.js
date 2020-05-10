module.exports = function (app, gestorBD) {

    app.get("/api/usuario", function (req, res) {
        gestorBD.obtenerUsuarios({}, function (usuarios) {
            if (usuarios == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(usuarios));
            }
        });
    });


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
                    token: token,
                    email: req.body.email
                })
            }
        });
    });

    app.get("/api/friends", function (req, res) {
        var criterio = {
            $and: [{$or: [{friend1: res.usuario}, {friend2: res.usuario}]}]
        };
        gestorBD.obtenerAmistades(criterio, function (amistades) {
            if (amistades == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                var amigos = [];
                for (i = 0; i < amistades.length; i++) {
                    if (amistades[i].friend1 == res.usuario)
                        amigos.push(amistades[i].friend2);
                    else
                        amigos.push(amistades[i].friend1);
                }

                var criterio2 = {email: {$in: amigos}};
                gestorBD.obtenerUsuarios(criterio2, function (usuarios) {
                    if (usuarios == null) {
                        res.status(500);
                        res.json({
                            error: "Se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send(JSON.stringify(usuarios));
                    }
                });
            }
        });
    });
};
