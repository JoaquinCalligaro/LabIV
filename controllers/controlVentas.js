import { param, validationResult } from 'express-validator';
import { body, validationResult as checkValidationResult } from 'express-validator';
import db from "../config/dbconfig.js";
//GET ALL
const getAllVentas = ('/ventas', async (req, res)=>{
    const [rows, _] = await db.execute('SELECT idventas,fecha FROM ventas');
    res.send(rows);
});


const getVentasById = [
    param('id').isInt({ min: 1, max: 2389489187 }).withMessage('El parámetro id debe ser un número entero entre 1 y 2389489187'),
    async (req, res) => {
        const validacion = checkValidationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errores: validacion.errors });
            return;
        }

        const idventas = req.params.id;

        try {
            const [rows, _] = await db.execute('SELECT * FROM ventas WHERE idventas = :id', { id: idventas });
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.status(404).send({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error en el servidor' });
        }
    }
];

const createVentas = [
    body('idventas').isInt({ min: 1, max: 100000 }).notEmpty().withMessage('El idventas debe ser un número entero entre 1 y 100000'),
    body('fecha').notEmpty().withMessage('La fecha es requerida'),
    body('cliente').notEmpty().withMessage('El cliente es requerido'),
    async (req, res) => {
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errors: validacion.array() });
            return;
        }

        const nuevaVenta = req.body;
        try {
            await db.execute('INSERT INTO ventas (idventas, fecha, cliente) VALUES (?, ?, ?)', [
                nuevaVenta.idventas,
                nuevaVenta.fecha,
                nuevaVenta.cliente 
            ]);

            res.status(201).json({
                ...nuevaVenta,
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ message: 'Ya existe una venta con ese ID.' });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Error del servidor.' });
            }
        }
    }
];

const deleteVenta = [
    param('id').isInt({ min: 1, max: 2389489187 }).withMessage('El parámetro id debe ser un número entero entre 1 y 2389489187'),
    async (req, res) => {
        const validacion = checkValidationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errores: validacion.errors });
            return;
        }

        const idventas = req.params.id;

        try {
            const [rows, _] = await db.execute('SELECT * FROM ventas WHERE idventas = ?', [idventas]);

            if (rows.length === 0) {
                res.status(404).send({ message: "venta no encontrada." });
            } else {
                await db.execute('DELETE FROM ventas WHERE idventas = ?', [idventas]);
                res.send({ message: 'venta eliminada correctamente.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error del servidor" });
        }
    }
];


export{
    getAllVentas,
    getVentasById,
    createVentas,
    deleteVenta
}
