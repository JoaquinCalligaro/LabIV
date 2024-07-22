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


//Rutas 
app.use(rutasProductos);
app.use(rutasVentas);




app.listen(3000, ()=> {
    console.log('La Base de dato esta funcionando en el puerto 3000');
});