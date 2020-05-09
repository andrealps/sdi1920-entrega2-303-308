module.exports = function (app, swig, gestorBD) {
    /**
     * Lista los usuarios que se encuentran en la aplicación
     */
    app.get("/listaUsuarios", function (req, res) {
        // Búsqueda
        let criterio = {
            $and: [{email: {$ne: req.session.usuario}, rol: {$ne: "admin"}}]
    };

        if (req.query.busqueda != null) {
            criterio.$and.push({
                $or: [{"nombre": {$regex: ".*" + req.query.busqueda + ".*"}},
                    {"apellidos": {$regex: ".*" + req.query.busqueda + ".*"}},
                    {"email": {$regex: ".*" + req.query.busqueda + ".*"}}]
            });
        }
        let pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }
        // Obtenemos los usuarios de la BD
        gestorBD.obtenerUsuariosPg(criterio, pg, function (usuarios, total) {
            if (usuarios == null) {
                res.send("Error al listar ");
            } else {
                // Sacar usuarios por página
                // Nos restamos a nosotros mismos y al administrador
                let ultimaPg = (total - 2) / 5;
                if ((total - 2) % 5 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                let paginas = []; // paginas mostrar
                for (let i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }

                // Sacamos el rol del usuario
                let criterio = {
                    email: req.session.usuario,
                };

                gestorBD.obtenerUsuarios(criterio, function (usuario) {
                    if (usuario == null) {
                        res.send("Error al obtener la lista de usuarios");
                    } else {
                        res.send(app.renderView("views/blistaUsuarios.html", req.session, {
                            usuarios: usuarios,
                            paginas: paginas,
                            actual: pg,
                            rol: usuario[0].rol,
                            busqueda: req.query.busqueda
                        }));
                    }
                });
            }
        });
    });
};
