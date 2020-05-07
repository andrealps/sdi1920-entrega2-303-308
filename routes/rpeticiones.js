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
        console.log(friendRequest);
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
            console.log(peticiones);
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
        console.log(criterio);

        gestorBD.obtenerPeticiones(criterio, function (peticiones) {
            let criterio = {"_id": peticiones[0]};
            let update = {accepted: true};
            console.log(peticiones[0]);

            gestorBD.aceptarPeticion(criterio, update, function (requestAccepted) {
                if (requestAccepted == null)
                    res.send("Error al añadir amigo");
                else {
                    // Se crea la amistad
                    let friendship = {
                        userFrom: req.params.email,
                        userTo: req.session.usuario
                    };
                    gestorBD.insertarAmistad(friendship, function (friends) {
                        if (!friends) {
                            res.send("There was an error adding");
                        } else {
                            res.redirect("/listFriendRequests" +
                                "?mensaje=¡Petición aceptada!" +
                                "&tipoMensaje=alert-success ");
                        }
                    })
                }

            })
        })


    });
};
