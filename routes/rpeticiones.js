module.exports = function (app, swig, gestorBD) {

    /**
     * Enviar peticion de amistad
     */
    app.get("/friendRequest/send/:id", function (req, res) {
        let userTo = gestorBD.mongo.ObjectID(req.params.id);
        let friendRequest = {
            userFrom: req.session.usuario,
            userTo: userTo
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
        let criterio = {email: req.session.usuario};
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {

            // Busco las peticiones dirigidas al usuario en sesion
            let criterioPeticion = {userTo: usuarios[0]._id};

            gestorBD.obtenerPeticiones(criterioPeticion, function (peticiones) {
                if (peticiones == null) {
                    res.send("Error al listar");
                } else {
                    let peticionesIds = [];
                    for (i = 0; i < peticiones.length; i++) {
                        peticionesIds.push(peticiones[i].userFrom);
                    }

                    let criterio = {"email": {$in: peticionesIds}};
                    gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                        let respuesta = swig.renderFile('views/blistaPeticiones.html', {
                            usuarios: usuarios
                        });
                        res.send(respuesta);
                    })
                }
            });
        })
    })
};
