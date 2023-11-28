import {usersServices} from "../services/index.js";
import { logger } from "../config/logger.js"


export const login = async (req, res) => {
    try {
        if(!req.user) return res.status(400).send({message:"Credenciales invalidas"})
        const user = req.user;
        const access_token = await usersServices.loginUser(user);
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
        console.log(user);
        const access_token = await usersServices.registerUser(user)
      
        res.status(201).cookie("coderCookie", access_token, {
          maxAge: 5 * 60 * 60 * 1000,
          httpOnly: true
        }).send({message: "Logueado"})
    } catch (error) {
        logger.error('An error occurred' + error.message)
        res.status(500).send("Error en la autenticación: " + error.message)
    }
}

export const logout = async (req, res) => {
    try {
        const user = req.user
        const session = req.session
        const end = await usersServices.logOut(session);
        if(end.success){
            user.last_connection = new Date().toLocaleString()
            await user.save()
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
        const response = usersServices.sendMail(email)
        res.status(200).send({success: true, message: await response.message})
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}

export const newPassword = async (req, res) => {
    try {
        const pass = req.body.password;
        const mail = req.body.email
        const response = usersServices.newPassword(mail, pass)
        res.status(200).send({success: true, message: await response.message})
    } catch (error) {
        res.status(500).send({success:false, messagge: error.message})
    }
}

export const changeRole = async (req, res) => {
    const id = req.params.uid
    
    const rol = req.body.rol

    try {
        const changeRoleUser = await usersServices.changeRole(id, rol)
        if(!changeRoleUser) res.status(400).json({succes: false, message: changeRoleUser})

        res.status(200).json({succes: true, message: changeRoleUser})
    } catch (error) {
        res.status(500).send({succes: false, message: error.message})
    }
}