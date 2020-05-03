module.exports = function (app, swig, gestorBD) {
    /**
     * Reinicio de la base de datos
     */
    app.get("/reiniciarBD", function (req, res) {
        // Eliminamos todos los usuarios de la BD
        gestorBD.eliminarUsuarios(function (usuarios) {
            if (usuarios == null) {
                res.send("Error al eliminar los usuarios");
            } else {
                let usuarios = [
                    {
                        "nombre": "Marina",
                        "apellidos": "Nunier Osuna",
                        "email": "ejemplo1@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "Samuel",
                        "apellidos": "García Domínguez",
                        "email": "ejemplo2@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "Guzmán",
                        "apellidos": "Nunier Osuna",
                        "email": "ejemplo3@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "Nadia",
                        "apellidos": "Shanaa",
                        "email": "ejemplo4@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "Lucrecia",
                        "apellidos": "Montesinos Hendrich",
                        "email": "ejemplo5@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "Ander",
                        "apellidos": "Muñoz",
                        "email": "ejemplo6@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "Carla",
                        "apellidos": "Rosón Caleruega",
                        "email": "ejemplo7@gmail.com",
                        "password": "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098",
                        "rol": "estandar"
                    },
                    {
                        "nombre": "admin",
                        "apellidos": "",
                        "email": "admin@email.com",
                        "password": "admin",
                        "rol": "admin"
                    }
                ];
                // Insertamos nuevos usuarios para pruebas
                gestorBD.insertarListaUsuarios(usuarios, function (usuarios) {
                    if (usuarios == null) {
                        res.send("Error al insertar los usuarios");
                    }
                    else {
                        res.send(app.renderView("views/bidentificacion.html", {}));
                    }
                });
            }
        });
    });
};