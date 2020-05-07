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
    /*app.get("/friendRequest/accept/:id", function (req, res) {

        let criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {

            // Busco las peticiones del usuario en sesiion
            let criterioUserTo = {
                userTo: usuarios[0]._id
            };
            
            gestorBD.obtenerPeticiones(criterioUserTo, function (peticiones) {

                // Busco la peticion que se acaba de aceptar
                let criterioPeticion = {
                    user: usuarios[0]._id,
                    friendId: gestorBD.mongo.ObjectID(req.params.id)
                };
                console.log(criterioPeticion);



            })
            
        });

    });*/
};
