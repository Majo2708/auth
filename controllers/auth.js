const bcrypt = require('bcrypt');
const saltRounds = 10;
const { user } = require('../models/user'); //Nombre del archivo, la constante se tiene que llamar igual que la del modelo. const User = require('./models/user').user;
const jwt = require('../services/jwt')

exports.login = (req, res) => {//Es como declarar una función anónima
    let params = req.body;

    //Validando
    if(params.email && params.password){
        user.findOne({email: params.email}, (err, respuesta) => {
            if (err) {
                res.status(500).json({message: 'Ocurrió un error al iniciar sesión.'});
            }
            if(respuesta !== null){//Validamos que la respuesta no sea vacía
                bcrypt.compare(params.password, respuesta.password, function(err, resp) {
                    if(err){
                        res.status(500).json({message: 'Ocurrió un error', err});
                    }else if(resp){
                        res.status(201).json({status: 'OK', data: respuesta, token: jwt.createToken(respuesta)});
                    } else{
                        res.status(404).json({message: 'Password incorrecto.'});
                    }
                });   
            }else{
                res.status(400).json({message: `No se encontró el Email: ${params.email}.`});
            }
        })
    }
    else{
        res.status(400).json({message: 'No se envió el Email y/o Password, favor de verificar.'})
    }       
}

exports.register = (req, res) => {
    let params = req.body;

    //Validando
    if(params.email && params.password && params.name){
        user.findOne({email: params.email}, (err, respuesta) => {
            if (err) {
                res.status(500).json({message: 'Ocurrió un Error.'});
            }
            if(respuesta !== null){//Validamos que la respuesta no sea vacía
                    res.status(200).json({message: `El correo ${params.email} ya esta en uso.`})
            }else{

                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(params.password, salt, function(err, hash) {
                        let newUser = user({
                            name: params.name,
                            email: params.email,
                            password: hash
                        });
                        newUser.save((err, resp) => {
                            if(err){
                                res.status(500).json({message: 'Ocurrió un error', err});
                            }else if(resp){
                                newUser.password = ':(' //Para no mostrar el password encriptado, pero que si se guardó
                                res.status(201).json({status: 'OK', data: resp});
                            } else{
                                res.status(400).json({message: 'No se creó el usuario.'});
                            }
                        });
                       
                        //res.send(newUser); //Enviar un texto de respuesta
                    });
                });             
            }
        })
    }
    else{
        res.status(400).json({message: 'Sin datos.'})
    }   
}