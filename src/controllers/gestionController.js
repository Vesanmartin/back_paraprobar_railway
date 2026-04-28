let proyectos = [];

const getGestion = (req, res) => {
    res.json(proyectos);
};

const crearGestion = (req, res) => {
    const nuevo = req.body;
    proyectos.push(nuevo);
    res.json({ mensaje: "Proyecto creado", nuevo });
};

const actualizarGestion = (req, res) => {
    const id = req.params.id;

    if (!proyectos[id]) {
        return res.status(404).json({ mensaje: "No encontrado" });
    }

    proyectos[id] = req.body;

    res.json({ mensaje: "Proyecto actualizado" });
};

const eliminarGestion = (req, res) => {
    const id = req.params.id;

    if (!proyectos[id]) {
        return res.status(404).json({ mensaje: "No encontrado" });
    }

    proyectos.splice(id, 1);

    res.json({ mensaje: "Proyecto eliminado" });
};

module.exports = {
    getGestion,
    crearGestion,
    actualizarGestion,
    eliminarGestion
};