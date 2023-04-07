const router = require("express").Router();
const bcrypt = require("bcryptjs")
const User = require("../models/User.model.js")
const jwt = require("jsonwebtoken")

// 5. Llamamos el MiddleWare (isAuthenticated)
const isAuthenticated = require("../middlewares/auth.middlewares.js")

//* routas de authentification
// POST "/auth/signup" Registar en la base de datos
router.post("/signup", async (req, res, next) => {

    const { email, password } = req.body
    console.log(req.body)
    //1.Validaciones de backend

    //Validar que los campos no esten vacios
    if(!email || !password) {
        res.status(400).json({errorMessage: "All fields are required"})
        return; // Para detener la funcion, detener la ruta
    }


    try {

        const foundUserEmail = await User.findOne({email : email})

        if(foundUserEmail !== null){
            res.status(400).json({errorMessage: "This email has already been used"})
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        console.log(hashPassword)

        await User.create({
            email: email,
            password: hashPassword,
            name: "Username",
            friends:[],
        })
        res.json("Usuario creado")
    } catch (error) {
        next(error)
    }


});

// POST "/auth/login" Validar las credenciales des usuario
router.post("/login", async (req, res, next) => {


    const {email, password} = req.body
    console.log(req.body)

    try {

        //Verificar que el usuario exista en la BD
    const foundUser = await User.findOne({email:email})
    console.log(foundUser)
    if(!foundUser){
        res.status(400).json({errorMessage: "identifiants invalides"})
        return;
    }
        //Validar si la contraseña es la correcta
        
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password )
    if(!isPasswordCorrect){
        res.status(400).json({errorMessage: "identifiants invalides"})
    }

    //res.json("Has iniciado sesion")

    // 3. =>IMPLEMENTACION DEL TOKEN    
    //3.1 payload => Contenido del token que identifica al usuario
    const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role
        //Aqui pondremos los roles mas adelante.
    }

    //3.2 generamos el token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm:"HS256", // Tipo de algoritmo a utilizar (este no nos da fallos)
        expiresIn:"1d" // duracion del token => 1 dia
    })

    res.status(200).json({authToken:authToken})
    //console.log("looooool",authToken)  
        
    } catch (error) {
        next(error)
    }


});

// GET "/auth/verify" => verificar si el usuario esta activo

router.get("/verify", isAuthenticated, (req, res, next) => {

console.log(req.payload)    
res.status(200).json(req.payload)

});










module.exports = router;