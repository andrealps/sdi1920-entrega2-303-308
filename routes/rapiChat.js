module.exports = function (app, gestorBD) {
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
                    //numero_mensaje: friends.chat.length + 1,
                    emisor: res.usuario,
                    receptor: req.body.userTo,
                    texto: req.body.texto,
                    fecha: Date.now(),
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
    });

    /**
     * S4 - Usuario identificado: Obtener mis mensajes de una "conversación"
     */
    app.get("/api/chat/:otherUser", function (req, res) {
        // Buscamos la amistad en la base de datos
        let criterio = {
            $or: [
                {usuario1: res.usuario, usuario2: req.params.otherUser},
                {usuario1: req.params.otherUser, usuario2: res.usuario}
            ]
        };
        // Comprobamos que son amigos
        gestorBD.obtenerAmistades(criterio, function (friends) {
            if (friends == null || friends.length === 0) {
                res.status(500);
                res.json({
                    error: "Error, los usuarios no son amigos"
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
                            mensajes: chats
                        });
                        //res.send(JSON.stringify(friends[0].chat));
                    }
                });
            }
        });
    });
};