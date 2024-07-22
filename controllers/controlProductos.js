import db from "../config/dbconfig.js";
import { param, validationResult } from 'express-validator';
import { body, validationResult as checkValidationResult } from 'express-validator';

//GET ALL
const getAllProductos = async (req, res) => {
    try {
        const [rows, _] = await db.execute('SELECT idproductos, nombre FROM productos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};


//GET x ID: Validacion
const getProductoById = [
    param('id').isInt({ min: 1, max: 2389489187 }).withMessage('El parámetro id debe ser un número entero entre 1 y 2389489187'),
    async (req, res) => {
        const validacion = checkValidationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errores: validacion.errors });
            return;
        }

        const productoId = req.params.id;

        try {
            const [rows, _] = await db.execute('SELECT * FROM productos WHERE idproductos = :id', { id: productoId });
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.status(404).send({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error en el servidor' });
        }
    }
];


//POST: Validacion
const createProductos = [
    body('rubro').notEmpty(),
    body('nombre').notEmpty(),
    body('precio').notEmpty(),
    body('precio').isFloat({ min: 1, max: 100000000 }),
    async (req, res) => {
        const validacion = checkValidationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errors: validacion.errors });
            return;
        }

        const nuevoProducto = req.body;
        try {
            const [ rows,_ ] = await db.execute('INSERT INTO productos (rubro, nombre, precio) VALUES (?, ?, ?)', [
                nuevoProducto.rubro,
                nuevoProducto.nombre,
                nuevoProducto.precio
            ]);

            res.status(201).json({
                id: rows.insertId,
                ...nuevoProducto,
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ message: 'Ya existe un producto con ese ID.' });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Error del servidor.' });
            }
        }
    }
];

// //PUT
// const updateProductos = [
//     param('id').isInt({ min: 1, max: 2389489187 }).withMessage('El parámetro id debe ser un número entero entre 1 y 2389489187'),
//     body('rubro').notEmpty(),
//     body('nombre').notEmpty(),
//     body('precio').isFloat({ min: 1, max: 100000000 }).notEmpty(),
//     async (req, res) => {
//         const validacion = validationResult(req);
//         if (!validacion.isEmpty()) {
//             res.status(400).json({ errors: validacion.errors });
//             return;
//         }

//         const productoId = req.params.id;
//         const nuevoProducto = req.body;

//         try {
//             const [rows, _] = await db.execute('SELECT * FROM productos WHERE idproductos = ?', [productoId]);

//             if (!rows.length) {
//                 res.status(404).send({ message: 'Producto no encontrado' });
//                 return;
//             }

//             await db.execute('UPDATE productos SET rubro = ?, nombre = ?, precio = ? WHERE idproductos = ?', [
//                 nuevoProducto.rubro,
//                 nuevoProducto.nombre,
//                 nuevoProducto.precio,
//                 productoId
//             ]);

//             res.send({ message: 'Producto actualizado correctamente' });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'Error del servidor.' });
//         }
//     }
// ];


//DELETE: Validacion
const deleteProducto = [
    param('id').isInt({ min: 1, max: 2389489187 }).withMessage('El parámetro id debe ser un número entero entre 1 y 2389489187'),
    async (req, res) => {
        const validacion = checkValidationResult(req);
        if (!validacion.isEmpty()) {
            res.status(400).json({ errores: validacion.errors });
            return;
        }

        const productoId = req.params.id;

        try {
            const [rows, _] = await db.execute('SELECT * FROM productos WHERE idproductos = ?', [productoId]);

            if (rows.length === 0) {
                res.status(404).send({ message: "Producto no encontrado." });
            } else {
                await db.execute('DELETE FROM productos WHERE idproductos = ?', [productoId]);
                res.send({ message: 'Producto eliminado correctamente.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error del servidor" });
        }
    }
];



// GET: Obtener todas las ventas para un producto específico
const getAllVentasForProducto = async (req, res) => {
    const productoId = req.params.id;

    try {
        // Realiza la consulta para obtener las ventas asociadas al producto
        const [rows, _] = await db.execute(`
            SELECT v.idventas, v.fecha, v.cliente, vp.cantidad
            FROM ventas v
            JOIN ventas_productos vp ON v.idventas = vp.ventas_idventas
            WHERE vp.productos_idproductos = ?`, [productoId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas para el producto con el ID proporcionado.' });
        }

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};



//Export
export {
    getAllProductos,
    getProductoById,
    createProductos,
    // updateProductos,
    deleteProducto,
    getAllVentasForProducto
};

