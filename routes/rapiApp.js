module.exports = function (app, gestorBD) {
    /**
     * Obtener número de mensajes sin leer para el usuario
     */
    app.get("/api/chat/last", function (req, res) {
        // Buscamos las amistades en la base de datos
        let criterio = {
            $and: [{$or: [{friend1: res.usuario}, {friend2: res.usuario}]}]
        };
        gestorBD.obtenerElementos('friends', criterio, function (friends) {
            if (friends == null || friends.length === 0) {
                res.status(500);
                res.json({
                    error: "Error"
                })
            } else {
                let amigos = [];
                for (let i = 0; i < friends.length; i++) {
                    if (friends[i].friend1 === res.usuario)
                        amigos.push(friends[i].friend2);
                    else
                        amigos.push(friends[i].friend1);
                }

                criterio = {
                    $and: [{emisor: {$in: amigos}, receptor: res.usuario, leido: false}]
                };
                // Obtenemos los mensajes del chat entre ellos
                gestorBD.obtenerElementos('chats', criterio, function (chats) {
                    if (chats == null) {
                        res.status(500);
                        res.json({
                            error: "Error al buscar los chats"
                        })
                    } else {
                        let sinLeer = chats.length;
                        res.status(200);
                        res.json({
                            sinLeer: sinLeer
                        });
                    }
                });
            }
        });

    });

    /**
     * S2 - Lista de amigos
     */
    app.get("/api/friends", function (req, res) {
        let criterio = {
            $and: [{$or: [{friend1: res.usuario}, {friend2: res.usuario}]}]
        };
        gestorBD.obtenerAmistades(criterio, function (amistades) {
            if (amistades == null) {
                res.status(500);
                res.json({
                    error: "Se ha producido un error"
                })
            } else {
                let amigos = [];
                for (let i = 0; i < amistades.length; i++) {
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
                        criterio = {
                            $or: [{emisor: {$in: amigos}, receptor: res.usuario},
                                {receptor: res.usuario, emisor: {$in: amigos}}
                            ]
                        };
                        // Ahora obtenemos el último mensaje en su conversación
                        gestorBD.obtenerUltimoMensaje(amigos, res.usuario, function (ultsMensajes) {
                            if (ultsMensajes == null) {
                                res.status(500);
                                res.json({
                                    error: "Se ha producido un error"
                                })
                            } else {
                                res.status(200);
                                res.json({
                                    ultsMensajes: ultsMensajes,
                                    friends: usuarios,
                                    usuario: res.usuario
                                });
                            }
                        })
                    }
                });
            }
        });
    });

    /**
     * S3 - Usuario identificado: Crear un mensaje
     */
    app.post("/api/mensaje", function (req, res) {
        if (res.usuario === req.body.userTo) {
            res.status(500);
            res.json({
                error: "Error, no puedes mandarte mensajes a ti mismo!"
            });
        } else {
            // Buscamos la amistad en la base de datos
            let criterio = {
                $or: [
                    {friend1: res.usuario, friend2: req.body.userTo},
                    {friend1: req.body.userTo, friend2: res.usuario}
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
                    let mensaje = {
                        //numero_mensaje: friends.chat.length + 1,
                        emisor: res.usuario,
                        receptor: req.body.userTo,
                        texto: req.body.texto,
                        fecha: new Date(),
                        leido: false
                    };
                    gestorBD.insertarMensaje(mensaje, function (result) {
                        res.status(200);
                        res.json({
                            mensaje: "Mensaje " + result + " insertado"
                        })
                    })
                }
            });
        }
    });


    /**
     * S4 - Usuario identificado: Obtener mis mensajes de una "conversación"
     */
    app.get("/api/chat/:otherUser", function (req, res) {
        if (res.usuario === req.params.otherUser) {
            res.status(500);
            res.json({
                error: "Error, no puedes tener conversaciones contigo mismo!"
            });
        } else {
            // Buscamos la amistad en la base de datos
            let criterio = {
                $or: [
                    {friend1: res.usuario, friend2: req.params.otherUser},
                    {friend1: req.params.otherUser, friend2: res.usuario}
                ]
            };
            // Comprobamos que son amigos
            gestorBD.obtenerAmistades(criterio, function (friends) {
                if (friends == null || friends.length === 0) {
                    res.status(500);
                    res.json({
                        error: "Error, no sois amigos!"
                    })
                } else {
                    criterio = {
                        $or: [
                            {emisor: res.usuario, receptor: req.params.otherUser},
                            {emisor: req.params.otherUser, receptor: res.usuario}
                        ]
                    };
                    // Obtenemos los mensajes del chat entre ellos
                    gestorBD.obtenerElementos('chats', criterio, function (chats) {
                        if (chats == null) {
                            res.status(500);
                            res.json({
                                error: "Error al buscar los chats"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensajes: chats,
                                usuario: res.usuario
                            });
                        }
                    });
                }
            });
        }
    });

    /**
     * S5 - Usuario identificado: Marcar mensaje como leído
     */
    app.put("/api/chat/leer/:id", function (req, res) {
        let criterio = {_id: gestorBD.mongo.ObjectID(req.params.id)};

        // Buscamos el mensaje en la base de datos
        gestorBD.obtenerElementos('chats', criterio, function (mensajes) {
            if (mensajes == null || mensajes.length === 0) {
                res.status(500);
                res.json({
                    error: "Error, el mensaje no existe"
                })
            } else {
                // Comprobamos que el usuario sea el receptor del mensaje
                if (res.usuario !== mensajes[0].receptor) {
                    res.status(500);
                    res.json({
                        error: "Error, no eres el receptor del mensaje!"
                    })
                } else {
                    let mensaje = {leido: true};
                    // Marcamos el mensaje como leído
                    gestorBD.modificarElemento('chats', criterio, mensaje, function (chats) {
                        if (chats == null) {
                            res.status(500);
                            res.json({
                                error: "Error al buscar los chats"
                            })
                        } else {
                            res.status(200);
                            res.json({
                                mensaje: "Mensaje modificado"
                            });
                            //res.send(JSON.stringify(friends[0].chat));
                        }
                    });
                }
            }
        });
    });
};