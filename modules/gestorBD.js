module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    // Obtiene los usuarios con paginación
    obtenerUsuariosPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(usuarios, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    // Obtener último mensaje para cada conversación entre dos usuarios
    obtenerUltimoMensaje: function (amigos, usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('chats');
                collection.aggregate([
                    {
                        $match: {
                            $or: [
                                {emisor: {$in: amigos}, receptor: usuario},
                                {emisor: usuario, receptor: {$in: amigos}}
                            ]
                        }
                    },
                    {$group: {_id: {emisor: "$emisor", receptor: "$receptor"}, fecha: {$last: "$fecha"}}}
                ]).toArray(function (err, lista) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(lista);
                    }
                    db.close();
                });
            }
        });
    },

    // Obtiene los elementos de una colección cuyo nombre se pasa por parámetro
    obtenerElementos: function (nombreColeccion, criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(nombreColeccion);
                collection.find(criterio).toArray(function (err, lista) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(lista);
                    }
                    db.close();
                });
            }
        });
    },
    // Modifica elementos de una colección atentiendo a un criterio
    modificarElemento: function (nombreColeccion, criterio, elemento, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(nombreColeccion);
                collection.update(criterio, {$set: elemento}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    // Elimina todos los elementos de una colección
    eliminarElementos: function (nombreColeccion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(nombreColeccion);
                collection.remove({}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    // Inserta nuevos elementos en una colección
    insertarElementos: function (nombreColeccion, elementos, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection(nombreColeccion);
                collection.insert(elementos, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    }
};
