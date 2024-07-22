import express from 'express';
import {getAllVentas, createVentas , getVentasById,deleteVenta} from '../controllers/controlVentas.js';

const router = express.Router();

// RUTAS CRUD PARA ventas

router.get('/ventas', getAllVentas);
router.get('/ventas/:id', getVentasById);
router.post('/ventas', createVentas);
router.delete('/ventas/:id', deleteVenta);

export default router;