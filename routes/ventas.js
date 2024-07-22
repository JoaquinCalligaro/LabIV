import express from 'express';
import {getAllVentas, createVentas,createVentasById , getVentasById,deleteVenta, getAllProductoForVenta} from '../controllers/controlVentas.js';

const router = express.Router();

// RUTAS CRUD PARA ventas

router.get('/ventas', getAllVentas);
router.get('/ventas/:id', getVentasById);
router.post('/ventas', createVentas);
router.post('/ventas/:id', createVentasById); 
router.delete('/ventas/:id', deleteVenta);
router.get('/ventas/:id/productos', getAllProductoForVenta)
export default router;