import { Router } from "express";
import passport from "passport";


const router = Router();

router.post("/login", passport.authenticate("login", "/login"), async(req, res) => {
    if(!req.user) return res.status(400).send("credenciales invaslidas")
    req.session.user = req.user

    return res.redirect("/profile")

})


router.post("/register", passport.authenticate("register", {failureRedirect: "/register"}), 
async(req, res) => {
    res.send("ok")
})


router.delete("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
        } else {
          console.log('Sesión cerrada exitosamente');
          res.send("ok")
        }
    });
})

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
        req.session.user = req.user
        console.log(req.session)
        res.redirect('/profile')
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
        req.session.user = req.user
        res.redirect('/profile')
    }
  )




export default router