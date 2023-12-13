export default class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    loginUser = async(user) => {
        return await this.dao.LoginUser(user)
    }

    registerUser = async(user) => {
        return await this.dao.RegisterUser(user)
    }

    logOut = async(session) => {
        return await this.dao.LogOut(session)
    }

    sendMail = async(email) => {
        return await this.dao.sendMail(email)
    }

    newPassword = async(mail, pass)=> {
        return await this.dao.NewPassword(mail, pass)
    }

    changeRole = async(id, rol) => {
        return await this.dao.changeRole(id, rol)
    }

    deleteUsersDisconnect= async() => {
        return await this.dao.deleteUsersDisconnect()
    }

    deleteOneUser = async(id) => {
        return await this.dao.deleteOneUser(id)
    }
}