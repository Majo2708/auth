const jwt = require('jsonwebtoken');

//Creando token - nos sirve para validar sesiones
exports.createToken = (data) => {
    return jwt.sign({data}, process.env.SECRET, {expiresIn: '1h'})
}