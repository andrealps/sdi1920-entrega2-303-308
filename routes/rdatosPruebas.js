module.exports = function (app, swig, gestorBD) {
    /**
     * Reinicio de la base de datos
     */
    app.get("/reiniciarBD", function (req, res) {
        // Eliminamos todos los usuarios de la BD
        gestorBD.eliminarElementos('usuarios', function (usuarios) {
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
                        "nombre": "Valerio",
                        "apellidos": "Montesinos",
                        "email": "ejemplo8@gmail.com",
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
                gestorBD.insertarElementos('usuarios', usuarios, function (usuarios) {
                    if (usuarios == null) {
                        res.send("Error al insertar los usuarios");
                    } else {
                        res.send(app.renderView("views/bidentificacion.html", {}));
                    }
                });
            }
        });

        // Eliminamos todas las peticiones de la BD
        gestorBD.eliminarPeticiones(function (usuarios) {
            if (usuarios == null) {
                res.send("Error al eliminar las peticiones");
            }
        });

        // Eliminamos todas las amistades de la BD
        gestorBD.eliminarAmistades(function (usuarios) {
            if (usuarios == null) {
                res.send("Error al eliminar las peticiones");
            }
        });

        // Eliminamos los chats
        gestorBD.eliminarElementos('chats', function (result) {
                if (result == null) {
                    res.send("Error al eliminar los usuarios");
                } else {
                    // Nuevas amistades
                    let amistades = [
                        {
                            "friend1": "ejemplo5@gmail.com",
                            "friend2": "ejemplo6@gmail.com"
                        },
                        {
                            "friend1": "ejemplo5@gmail.com",
                            "friend2": "ejemplo7@gmail.com"
                        },
                        {
                            "friend1": "ejemplo5@gmail.com",
                            "friend2": "ejemplo8@gmail.com"
                        }
                    ];

                    gestorBD.insertarElementos('friends', amistades, function (result) {
                        if (result == null) {
                            res.send("Error al insertar las amistades");
                        } else {
                            let chats = [
                                {
                                    "emisor": "ejemplo8@gmail.com",
                                    "receptor": "ejemplo5@gmail.com",
                                    "texto": "mensaje4",
                                    "fecha": new Date(),
                                    "leido": true
                                },
                                {
                                    "emisor": "ejemplo7@gmail.com",
                                    "receptor": "ejemplo5@gmail.com",
                                    "texto": "mensaje5",
                                    "fecha": new Date(),
                                    "leido": true
                                },
                                {
                                    "emisor": "ejemplo6@gmail.com",
                                    "receptor": "ejemplo5@gmail.com",
                                    "texto": "mensaje1",
                                    "fecha": new Date(),
                                    "leido": true
                                },
                                {
                                    "emisor": "ejemplo6@gmail.com",
                                    "receptor": "ejemplo5@gmail.com",
                                    "texto": "mensaje2",
                                    "fecha": new Date(),
                                    "leido": true
                                },
                                {
                                    "emisor": "ejemplo6@gmail.com",
                                    "receptor": "ejemplo5@gmail.com",
                                    "texto": "mensaje3",
                                    "fecha": new Date(),
                                    "leido": true
                                }
                            ];

                            // Nuevos chats
                            gestorBD.insertarElementos('chats', chats, function (result) {
                                if (result == null) {
                                    res.send("Error al insertar los chats");
                                }
                            });
                        }
                    });
                }
            }
        );
    });
};
