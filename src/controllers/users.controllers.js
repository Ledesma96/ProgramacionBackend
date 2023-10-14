import {userServices} from "../services/index.js";


export const login = async (req, res) => {
    try {
        if(!req.user) return res.status(400).json({message:"Credenciales invalidas"})
        const user = req.user;
        const access_token = await userServices.LoginUser(user);
        res.cookie("coderCookie", access_token, {
            maxAge: 60*60*10000,
            httpOnly: true
          }).send({message: "Logueado"})
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).send("Error en la autenticación: " + error.message);
    }
}

export const register = async (req, res) => {
    try {
        const user = req.body;
        const access_token = await userServices.RegisterUser(user)
      
        res.cookie("coderCookie", access_token, {
          maxAge: 60*60*10000,
          httpOnly: true
        }).send({message: "Logueado"})
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).send("Error en la autenticación: " + error.message)
    }
}

export const logout = async (req, res) => {
    try {
        const session = req.session
        const end = await userServices.LogOut(session);
        if(end.success){
            res.clearCookie('coderCookie');
            res.status(201).json(end.message)
        } else {
            res.status(401).json(end.message)
        }
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).json(error.error)
    }
}

export const sendMail = async (req, res) => {
    try {
        const email = req.body.email
        const response = userServices.sendMail(email)
        res.status(200).send({success: true, message: await response.message})
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}

export const newPassword = async (req, res) => {
    try {
        const pass = req.body.password;
        const mail = req.body.email
        const response = userServices.NewPassword(mail, pass)
        res.status(200).send({success: true, message: await response.message})
    } catch (error) {
        res.status(500).send({success:false, messagge: error.message})
    }
}