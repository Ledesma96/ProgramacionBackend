import {fileURLToPath} from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcrypt from "bcrypt"
import jwt  from 'jsonwebtoken'
import passport from 'passport'

const PRIVATE_KEY = "asdff48144as8f4f55a7s2d"

export const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
};

export const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "24h"})
    return token
}

export const authToken = (req, res, next) => {
    let authHeader = req.headers.auth
    if(!authHeader){
        authHeader = req.cookies["coderCookie"]
        if(!authHeader){
            return res.status(401).send({
                error: "Not auth"
            })
        }
    }

    const token = authHeader
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: "Not authorized"})

        req.user = credentials.user
        next()
    })
}

export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err)
            if(!user) {
                return res.status(401).send({
                    error: info.messages? info.messages : info.toString()
                })
            }
            req.user = user;
            next()
        }) (req, res, next)
    }
}

export const authorization = role => {

    return async (req, res, next) => {
        const user = req.user;

        if(!user) return res.status(401).send({error: "No autorizado"})
        if(user.user.rol !== role) return res.status(403).send({error: "el usuario no tiene permisos"})
    
        next()
    }
}

export default __dirname