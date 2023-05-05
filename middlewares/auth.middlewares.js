// 4. CREAMOS EL MIDDLEWARE PARA PODER SABER SI EL USUARIO ESTA AUTENTIFICADO.

const {expressjwt} = require("express-jwt")

const isAuthenticated = expressjwt({
    
    secret: process.env.TOKEN_SECRET,
    algorithms:["HS256"], 
    requestProperty: "payload", 
    getToken: (req) =>{

        if(req.headers === undefined || req.headers.authorization === undefined) {
            console.log("usuario no tiene token")
            return null
        }

        const tokenArr = req.headers.authorization.split(" ")
        const tokenType = tokenArr[0]
        const token = tokenArr[1]

        if(tokenType!== "Bearer"){
            console.log("token no valido")
            return null
        }

        console.log("token existente y de tipo correcto")
        return token

        


    }
})

module.exports = isAuthenticated