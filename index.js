//require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT; //Si encuentras una variable de entorno PORT tomala o si no el 3000
const verify = require('./middlewares/verifyToken');

//Para conectarse a la base de datos de Mongoose
mongoose.connect(process.env.mongoUrl, {useNewUrlParser: true}, (err)=>{
    if(!err){
        console.log('Mongo conectado correctamente.');
    }
})

const { login, register } = require('./controllers/auth');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) =>{
    res.send('<h1>Hola Mundo</h1>');
})

//Llenando el schema
app.post('/new/user', verify.verifyTkn, register)

app.post('/login', login) //login función declarada en controllers/login

app.listen(PORT, () => {
    console.log(`Servidor escuchando en port ${PORT}`); // o 'Servidor escuchando en puerto'
})