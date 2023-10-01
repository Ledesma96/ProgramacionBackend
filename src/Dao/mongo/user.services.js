import usersModel from "./models/users.model.js";
import { generateToken } from "../../uitils.js";
import CustomError from "../../services/error/custom_error.js";
import { generateUserErrorInfo } from "../../services/error/info.js";
import EErrors from "../../services/error/enums.js"

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

    LogOut = (session) => {
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
      
}

export default UserServices