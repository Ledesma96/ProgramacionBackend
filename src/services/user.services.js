import usersModel from "../Dao/models/users.model.js";
import { generateToken } from "../uitils.js";

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
            console.log(access_token);
            return access_token;
        } catch (error) {
            throw error;
        }
    }

    LogOut = async(session) => {
        console.log(session);
        session.destroy(err => {
            if (err) {
                return ({secces:false, message:"Error al cerrar sesión", err})
            } else {
              console.log('Sesión cerrada exitosamente');
              return ({success: true, message:"Sesion cerrada con exito"})
            }
        });
    }
}

export default UserServices