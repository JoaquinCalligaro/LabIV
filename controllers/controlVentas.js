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

const getAllProductoForVenta = async (req, res) => {
    const ventaId = req.params.id;
    try {
        // Realiza la consulta para obtener las ventas asociadas al producto
        const [rows, _] = await db.execute(`
            SELECT p.nombre, p.rubro, vp.cantidad, p.precio
            FROM productos p
            JOIN ventas_productos vp ON p.idproductos = vp.productos_idproductos
            WHERE vp.ventas_idventas = ?`, [ventaId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas para el cliente seleccionado' });
        }

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

const createVentas = [
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
            await db.execute('INSERT INTO ventas (fecha, cliente) VALUES (?, ?)', [
                nuevaVenta.fecha,
                nuevaVenta.cliente 
            ]);

            res.status(201).json({
                // id: rows.insertId,
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

const createVentasById = [
    param('id').isInt({ min: 1, max: 2389489187 }).withMessage('El parámetro id debe ser un número entero entre 1 y 2389489187'),
    body('cantidad').notEmpty().withMessage('La cantidad es requerida'),
    body('productos_idproductos').notEmpty().withMessage('El id producto es requerido'),
    async (req, res) => {
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errors: validacion.array() });
            return;
        }

        const { productos_idproductos, cantidad } = req.body;
        const ventas_idventas = req.params.id

        try {
            await db.execute('INSERT INTO ventas_productos (cantidad, productos_idproductos, ventas_idventas) VALUES (?, ?, ?)', [
                cantidad,
                productos_idproductos,
                ventas_idventas
            ]);

            res.status(201).json({
                cantidad,
                productos_idproductos,
                ventas_idventas
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
        const validacion = validationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errores: validacion.array() });
            return;
        }

        const idventas = req.params.id;

        try {
            
            await db.execute('DELETE FROM ventas_productos WHERE ventas_idventas = ?', [idventas]);

            const [rows, _] = await db.execute('DELETE FROM ventas WHERE idventas = ?', [idventas]);

            if (rows.affectedRows === 0) {
                res.status(404).send({ message: "Venta no encontrada." });
            } else {
                res.send({ message: 'Venta eliminada correctamente.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error del servidor." });
        }
    }
];


export{
    getAllVentas,
    getVentasById,
    createVentas,
    createVentasById,
    getAllProductoForVenta,
    deleteVenta
}
