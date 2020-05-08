module.exports = function (app, gestorBD) {
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
                    var mensaje = {
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
                            //res.send(JSON.stringify(friends[0].chat));
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