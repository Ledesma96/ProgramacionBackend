import usersModel from "./models/users.model.js";
import { createHash, generateToken } from "../../uitils.js";
import CustomError from "../../services/error/custom_error.js";
import { generateUserErrorInfo } from "../../services/error/info.js";
import EErrors from "../../services/error/enums.js"
import jwt from "jsonwebtoken";
import 'dotenv/config.js';
import mongoose from "mongoose";
import transport from "../../config/mailing.js";
class UserServices {
    constructor(){
        this.userModel = new usersModel();
    }

    LoginUser = async(user) => {
        try {
            const access_token = generateToken(user);
            return access_token;
          } catch (error) {
            throw error;
          }
    }

    RegisterUser = async(user) => {
        try {
          if(!user.first_name || !user.last_name || !user.email){
            CustomError.createError({
              name:"crear usuario",
              cause: generateUserErrorInfo(user),
              message: "error al intentar crear un usuario",
              code: EErrors.INVALID_TYPES_ERROR
            })
          }
            const access_token = generateToken(user);
            return access_token;
        } catch (error) {
            throw error;
        }
    }

    LogOut = async(session) => {
        return new Promise((resolve, reject) => {
          session.destroy((err) => {
            if (err) {
              console.error('Error al cerrar sesión:', err);
              reject({ success: false, message: 'Error al cerrar sesión', error: err });
            } else {
              resolve({ success: true, message: 'Sesión cerrada con éxito' });
            }
          });
        });
      };

      

    sendMail = async(email) => {
     
      const token = jwt.sign({email}, process.env.PRIVATE_KEY,{expiresIn: "1h"})
      const result = await transport.sendMail({
        from :'mailingprueba61@gmail.com',
        to: email,
        subject: 'Reset password',
        html:`<div>
                <p> Has click en el siguiente enlace para restablecer tu contraseña</p>
                <a href='http://127.0.0.1:8080/reset-password?token=${token}'>Restablecer password</a>
              </div>`
      })

      return ({succes: true, message: 'Proceso exitoso'})
    }

    NewPassword = async(mail, pass) => {
      console.log(mail, pass)
      try {
        const user = await usersModel.findOne({ email: mail});

        if (!user) return { success: false, message: 'Usuario no encontrado' }

        if(user.password === pass) return { success: false, message: 'No puedes usar el mismo password' };

        user.password = createHash(pass);
        await user.save()
        return ({ success: true, message: 'Password actualizado con exito'})
      } catch (error) {
        return ({succes: false, message: error.message})
      }

    }

    changeRole = async(id, rol) => {
      try {
        const _id = new mongoose.Types.ObjectId(id);
        const user = await usersModel.updateOne({_id: _id}, {$set:{rol}});
        if (!user) return 'No es posible cambiar el rol'

        return 'Rol cambiado con exito'
      } catch (error) {
        return error.message
      }
    }

    deleteUsersDisconnect = async() => {
      try {
        const actualDay = new Date().toLocaleString();
    
        const twoDaysAgo = new Date(actualDay);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
    
        const usersEliminated = await usersModel.find({last_connection: {$lt: twoDaysAgo}});

        const deletedUsers = await usersModel.deleteMany({
          last_connection: { $lt: twoDaysAgo },
          rol: { $ne: 'admin' } 
        })
        
        if (usersEliminated.length > 0) {
          for (let i = 0; i < usersEliminated.length; i++) {
              const email = usersEliminated[i].email;
              try {
                  const result = await transport.sendMail({
                      from: 'mailingprueba61@gmail.com',
                      to: email,
                      subject: 'Cuenta eliminada',
                      html: `<div>
                              <p> Se ha eliminado su cuenta por inactividad</p>
                            </div>`
                  });
                  console.log(`Correo enviado a ${email}: ${result.response}`);
              } catch (error) {
                  console.error(`Error al enviar correo a ${email}: ${error.message}`);
              }
          }
          return { success: true, message: `Se eliminaron ${usersEliminated.length} usuarios` };
      }

        return ({message: 'No se encontraron usuarios para eliminar'})


      } catch (error) {
        return {error: error.message};
      }
    }

    deleteOneUser = async(id) => {
      try {
        const _id = new mongoose.Types.ObjectId(id);
        const deletedUser = await usersModel.deleteOne({_id: _id, rol: {$ne: 'admin'}});
        return deletedUser
      } catch (error) {
        throw error
      }
    }

}

export default UserServices