module.exports = function (app, swig, gestorBD) {

    /**
     * Enviar peticion de amistad
     */
    app.get("/friendRequest/send/:email", function (req, res) {

        let friendRequest = {
            userFrom: req.session.usuario,
            userTo: req.params.email,
            accepted: false
        };

        gestorBD.insertarPeticion(friendRequest, function (idFriendRequest) {
            if (idFriendRequest == null) {
                res.send(respuesta);
            } else {
                res.redirect("/listaUsuarios");
            }
        });
    });

    /**
     * Lista las peticiones de amistad del usuario en sesion
     */
    app.get("/listFriendRequests", function (req, res) {
        let criterio = {$and: [{userTo: req.session.usuario}, {accepted: false}]};

        gestorBD.obtenerPeticiones(criterio, function (peticiones) {
            if (peticiones == null) {
                res.send("Error al listar");
            } else {
                let peticionesEmail = [];
                for (i = 0; i < peticiones.length; i++) {
                    peticionesEmail.push(peticiones[i].userFrom);
                }

                let criterio = {"email": {$in: peticionesEmail}};
                gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    let respuesta = swig.renderFile('views/blistaPeticiones.html', {
                        usuarios: usuarios
                    });
                    res.send(respuesta);
                })
            }
        })
    });

    /**
     * Aceptar petición de amistad
     */
    app.get("/friendRequest/accept/:email", function (req, res) {

        // Busco la peticion para marcarla a aceptada
        let criterio = {$and: [{userFrom: req.params.email}, {userTo: req.session.usuario}, {accepted: false}]};

        gestorBD.obtenerPeticiones(criterio, function (peticiones) {
            let criterio = {"_id": peticiones[0]._id};
            let update = {accepted: true};

            gestorBD.aceptarPeticion(criterio, update, function (requestAccepted) {
                if (requestAccepted == null)
                    res.send("Error al añadir amigo");
                else {
                    // Se crea la amistad
                    let friendship = {
                        friend1: req.params.email,
                        friend2: req.session.usuario
                    };
                    gestorBD.insertarAmistad(friendship, function (friends) {
                        if (!friends) {
                            res.send("There was an error adding");
                        } else {
                            res.redirect("/listFriendRequests" +
                                "?mensaje=¡Tienes un nuevo amigo!" +
                                "&tipoMensaje=alert-success ");
                        }
                    })
                }

            })
        })

    });

    /**
     * Ver mis amigos
     */
    app.get("/myFriends", function (req, res) {

        // Busco las amistades en las que aparezca el usuario en sesion
        let criterio = {$or: [{friend1: req.session.usuario}, {friend2: req.session.usuario}]};

        gestorBD.obtenerAmistades(criterio, function (amistades) {
            if (amistades == null) {
                res.send("Error al listar");
            } else {
                let friends = [];
                for (i = 0; i < amistades.length; i++) {
                    if (amistades[i].friend1 == req.session.usuario)
                        friends.push(amistades[i].friend2);
                    else if (amistades[i].friend2 == req.session.usuario)
                        friends.push(amistades[i].friend1);
                }

                let criterio = {"email": {$in: friends}};
                gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    let respuesta = swig.renderFile('views/blistaAmigos.html', {
                        usuarios: usuarios
                    });
                    res.send(respuesta);
                })
            }
        })
    });
};
