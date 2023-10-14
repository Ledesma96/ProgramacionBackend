import { Router } from "express";
import passport from "passport";
import { generateToken, authToken, passportCall, authorization } from "../uitils.js";
import { login, logout, newPassword, register, sendMail } from "../controllers/users.controllers.js";


const router = Router();

router.post("/login", passport.authenticate("login"), login)

router.post("/register", passport.authenticate("register", {failureRedirect: "/register"}), register)

router.get("/current", passportCall("jwt",{ session:false}), authorization("usuario"), (req,res) => {
  res.send({status: "success", payload: req.user })
})

router.get("/user", passportCall("jwt",{ session:false}), (req,res) => {
  res.send(req.user)
})

router.delete("/logout", logout)

router.post('/send-mail', sendMail)

router.post('/change-password', newPassword)

//ruta get para obtener el user en el javascript del front
router.get('/user', (req, res) => {
    const user = req.session.user;
    res.json(user);
});


//github

router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email'] }),
    async(req, res) => {}
  )
  router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/'}),
    async(req, res) => {
        const user = req.user
        const access_token = generateToken(user)

        res.cookie("coderCookie", access_token, {
          maxAge: 60*60*10000,
          httpOnly: true
        }).redirect('/profile')
        
    }
  )

 //google
 router.get(
    '/login-google',
    passport.authenticate('auth-google'),
    async(req, res) => {}
  )
  router.get(
    '/auth-google',
    passport.authenticate('auth-google', { failureRedirect: '/'}),
    async(req, res) => {
      const user = req.user
      const access_token = generateToken(user)

      res.cookie("coderCookie", access_token, {
        maxAge: 60*60*10000,
        httpOnly: true
      }).redirect('/profile')
    }
  )




export default router