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

                let pg = parseInt(req.query.pg); // Es String !!!
                if (req.query.pg == null) { // Puede no venir el param
                    pg = 1;
                }

                // Obtenemos los usuarios de la BD
                gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
                    if (usuarios == null) {
                        res.send("Error al listar ");
                    } else {
                        // Sacar usuarios por página
                        let ultimaPg = total / 5;
                        if (total % 5 > 0) { // Sobran decimales
                            ultimaPg = ultimaPg + 1;
                        }
                        let paginas = []; // paginas mostrar
                        for (let i = pg - 2; i <= pg + 2; i++) {
                            if (i > 0 && i <= ultimaPg) {
                                paginas.push(i);
                            }
                        }

                        // Sacamos el rol del usuario
                        let criterio = {
                            email: req.session.usuario,
                        };

                        gestorBD.obtenerUsuarios(criterio, function (usuario) {
                            if (usuario == null) {
                                res.send("Error al obtener la lista de usuarios");
                            } else {
                                res.send(app.renderView("views/blistaPeticiones.html", req.session, {
                                    usuarios: usuarios,
                                    paginas: paginas,
                                    actual: pg,
                                    rol: usuario[0].rol
                                }));
                            }
                        });
                    }
                });
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

                let pg = parseInt(req.query.pg); // Es String !!!
                if (req.query.pg == null) { // Puede no venir el param
                    pg = 1;
                }

                // Obtenemos los usuarios de la BD
                gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
                    if (usuarios == null) {
                        res.send("Error al listar ");
                    } else {
                        // Sacar usuarios por página
                        let ultimaPg = total / 5;
                        if (total % 5 > 0) { // Sobran decimales
                            ultimaPg = ultimaPg + 1;
                        }
                        let paginas = []; // paginas mostrar
                        for (let i = pg - 2; i <= pg + 2; i++) {
                            if (i > 0 && i <= ultimaPg) {
                                paginas.push(i);
                            }
                        }

                        // Sacamos el rol del usuario
                        let criterio = {
                            email: req.session.usuario,
                        };

                        gestorBD.obtenerUsuarios(criterio, function (usuario) {
                            if (usuario == null) {
                                res.send("Error al obtener la lista de amigos");
                            } else {
                                res.send(app.renderView("views/blistaAmigos.html", req.session, {
                                    usuarios: usuarios,
                                    paginas: paginas,
                                    actual: pg,
                                    rol: usuario[0].rol
                                }));
                            }
                        });
                    }
                });
            }
        })
    });
};
