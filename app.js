import express from "express";
import cors from 'cors';

// Importacion de rutas
import rutasProductos from './routes/productos.js'
import rutasVentas from './routes/ventas.js'


const app = express()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send('La API esta en funcionamiento.');
});


// Rutas

// PRODUCTOS
app.get('/productos', rutasProductos);
app.get('/productos/:id',rutasProductos);
app.post('/productos',rutasProductos);
app.put('/productos/:id', rutasProductos);
app.delete('/productos/:id',rutasProductos);
app.get('/productos/:id/ventas', rutasProductos);

// ventas
app.get('/ventas', rutasVentas);
app.get('/ventas/:id',rutasVentas);
app.post('/ventas',rutasVentas);
app.put('/ventas/:id',rutasVentas);
app.delete('/ventas/:id',rutasVentas);





app.listen(3000, ()=> {
    console.log('La Base de dato esta funcionando en el puerto 3000');
});