module.exports = function (app, swig, gestorBD) {

    /**
     * Enviar peticion de amistad
     */
    app.get("/friendRequest/send/:email", function (req, res) {

        // No puede enviar petición a un amigo
        let criterioAmigos = {
            $or: [{$and: [{friend1: req.session.usuario}, {friend2: req.params.email}]},
                {$and: [{friend1: req.params.email}, {friend2: req.session.usuario}]}]
        }

        gestorBD.obtenerElementos('friends', criterioAmigos, function (amistades) {
            if (amistades.length === 0) {

                // Si ya le ha mandado peticion, no puede volver a enviarsela
                let criterioPeticiones = {
                    $and: [{userFrom: req.session.usuario}, {userTo: req.params.email}]
                };

                gestorBD.obtenerElementos('friendRequests', criterioPeticiones, function (peticiones) {
                    if (peticiones.length === 0) {

                        let friendRequest = {
                            userFrom: req.session.usuario,
                            userTo: req.params.email,
                            accepted: false
                        };

                        gestorBD.insertarElementos('friendRequests', friendRequest, function (idFriendRequest) {
                            if (idFriendRequest == null) {
                                res.send(respuesta);
                            } else {
                                res.redirect("/listaUsuarios" +
                                    "?mensaje=¡Petición enviada!" +
                                    "&tipoMensaje=alert-success");
                            }
                        });

                    } else {
                        res.redirect("/listaUsuarios" +
                            "?mensaje=Ya has mandado petición a este usuario" +
                            "&tipoMensaje=alert-danger ");
                    }
                })

            } else {
                res.redirect("/listaUsuarios" +
                    "?mensaje=¡Ya sois amigos!" +
                    "&tipoMensaje=alert-danger ");
            }
        })
    });

    /**
     * Lista las peticiones de amistad del usuario en sesion
     */
    app.get("/listFriendRequests", function (req, res) {

        let criterio = {$and: [{userTo: req.session.usuario}, {accepted: false}]};

        gestorBD.obtenerElementos('friendRequests', criterio, function (peticiones) {
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

                        gestorBD.obtenerElementos('usuarios', criterio, function (usuario) {
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
        // Hay que hacerlo a la inversa también si se da el caso de peticiones mutuas
        let criterio = {
            $or: [{$and: [{userFrom: req.params.email}, {userTo: req.session.usuario}, {accepted: false}]},
                {$and: [{userFrom: req.session.usuario}, {userTo: req.params.email}, {accepted: false}]}]
        };
        let update = {accepted: true};

        gestorBD.obtenerElementos('friendRequests', criterio, function (peticiones) {
            for (let i = 0; i < peticiones.length; i++) {
                let criterio = {"_id": peticiones[i]._id};

                // Aceptamos la petición
                gestorBD.modificarElemento('friendRequests', criterio, update, function (requestAccepted) {
                    if (requestAccepted == null)
                        res.send("Error al aceptar la petición");

                })
            }
            // Se crea la amistad
            let friendship = {
                friend1: req.params.email,
                friend2: req.session.usuario
            };
            gestorBD.insertarElementos('friends', friendship, function (friends) {
                if (!friends) {
                    res.send("Error al añadir amigo");
                } else {
                    res.redirect("/listFriendRequests" +
                        "?mensaje=¡Tienes un nuevo amigo!" +
                        "&tipoMensaje=alert-success ");
                }
            })
        });
    });


    /**
     * Ver mis amigos
     */
    app.get("/myFriends", function (req, res) {

        // Busco las amistades en las que aparezca el usuario en sesion
        let criterio = {$or: [{friend1: req.session.usuario}, {friend2: req.session.usuario}]};

        // Sacamos los amigos
        gestorBD.obtenerElementos('friends', criterio, function (amistades) {
            if (amistades == null) {
                res.send("Error al listar");
            } else {
                let friends = [];
                for (let i = 0; i < amistades.length; i++) {
                    if (amistades[i].friend1 === req.session.usuario)
                        friends.push(amistades[i].friend2);
                    else if (amistades[i].friend2 === req.session.usuario)
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

                        gestorBD.obtenerElementos('usuarios', criterio, function (usuario) {
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
}
;
