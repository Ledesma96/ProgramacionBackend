import passport from "passport";
import local from "passport-local"
import usersModel from "../Dao/models/users.model.js";
import cartModel from "../Dao/models/cart.model.js"
import { createHash, generateToken, isValidPassword } from "../uitils.js";
import GitHubStrategy from "passport-github2"
import GoogleStrategy from "passport-google-oauth20"
import jwt  from "passport-jwt";

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies["coderCookie"] : null

    return token
}



const initializePassport = () => {
    //passport jwt

    passport.use("jwt",
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:"asdff48144as8f4f55a7s2d"
    },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload)
            } catch (error) {
                return done(error)
            }
        }
    ))


    //passport con google
    passport.use("auth-google", new GoogleStrategy({
        clientID: "517100169501-2kd998pqfhas6cg8php2ib931qakh9nd.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: 'http://127.0.0.1:8080/api/sessions/auth-google',
        scope: [ "profile", "email" ]
    }, 
    async(accessToken, refreshToken, profile,email, done) => {
        try {
            const user = await usersModel.findOne({email: email._json.email})
            if(user) {
                console.log("El usuario ya existe");
                return done(null, user)
            }
            const cart = new cartModel()
            await cart.save()
            const cartid = cart._id
            const newUser = {
                first_name: email._json.given_name, // Otra propiedad que podría tener el nombre
                last_name: email._json.family_name,
                age: "",
                password: "",
                cartId:cartid,
                email: email._json.email,
            }
            const result = new usersModel(newUser);
            await result.save()
            return done (null, result)
        } catch (error) {
            return done("error al logear con google" + error)
        }
    }));


    //passport con github
    passport.use("github", new GitHubStrategy(
        {
            clientID:"Iv1.ea9bf9ecfee1d87e",
            clientSecret: "6883ded6d451811eb675efe2071c6f267d68be20",
            callbackURL: "http://127.0.0.1:8080/api/sessions/githubcallback"
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                const user = await usersModel.findOne({email: profile._json.email})
                if(user) {
                    console.log("El usuario ya existe");
                    const access_token = generateToken(user);
                    user.token = access_token;

                    return done(null, user)
                }
                const cart = new cartModel()
                await cart.save()
                const cartid = cart._id
                const newUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    age:"",
                    cartId: cartid,
                    password:"",
                    email: profile._json.email,
                }
                const result = new usersModel(newUser);
                await result.save()

                return done (null, result)
            } catch (error) {
                return done("error al logear con gitHub" + error)
            }
        }
    ))


    //passport local
    passport.use("register", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        }, 
        async(req, username, password, done) => {
        const {first_name, email, last_name, age} = req.body

    try {
        const existUser = await usersModel.findOne({email: username})
        if(!existUser){
            const cart = new cartModel()
            await cart.save()
            const cartid = cart._id
            const newUser ={
                first_name,
                last_name,
                age,
                email,
                cartId: cartid,
                password: createHash(password)
            }
            console.log(newUser);
            const userCreated = new usersModel(newUser);
            await userCreated.save()
            return done(null, userCreated)
            
        }
        console.log(("El usuario ya existe"));
        return done(null, false)
        
    } catch (error) {
        return done("Error al registrar usuario", error)
    }
    }))

    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async(username, password, done) => {
            try {
                const user = await usersModel.findOne({email: username}).lean().exec()
                if(!user){
                    console.error("El usuario no existe")
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    console.error("Password invalido");
                    return done(null, false)
                }
                return done(null, user)
                
            } catch (error) {
                return done("Error al iniciar sesion", error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id)
        done(null, user)
    })
}

export default initializePassport