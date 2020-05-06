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
                // Obtenemos los mensajes del chat entre ellos
                res.status(200);
                res.json({
                    mensajes: friends[0].chat
                });
                //res.send(JSON.stringify(friends[0].chat));
            }
        });
    });
};