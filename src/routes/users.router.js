import { Router } from "express";
import usersModel from "../Dao/models/users.model.js";
 


const router = Router();





router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await usersModel.findOne({email, password})

        if(!user) return res.redirect("/login");

        req.session.user = user;
        return res.redirect("http://127.0.0.1:8080/")
        
    } catch (error) {
        res.status(401).send("Ha ocurrido un error")
    }
})
router.post("/registre", async(req, res) => {
    const user = req.body;

    try {
        const existUser = await usersModel.findOne({email: req.body.email})
        
        if(!existUser){
            const userCreated = new usersModel(user);
            await userCreated.save()
            res.status(201).send("Usuario creado con exito")
            res.send("ok")
        }
        res.send("el usuario ya existe")
        
    } catch (error) {
        res.status(401).send("Ha ocurrido un error al intentar crear un usuario")
    }
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

export default router