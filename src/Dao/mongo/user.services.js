import usersModel from "./models/users.model.js";
import { generateToken } from "../../uitils.js";

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