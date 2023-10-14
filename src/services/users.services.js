export default class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    LoginUser = async(user) => {
        return await this.dao.LoginUser(user)
    }

    RegisterUser = async(user) => {
        return await this.dao.RegisterUser(user)
    }

    LogOut = async(session) => {
        return await this.dao.LogOut(session)
    }

    sendMail = async(email) => {
        return await this.dao.SendMail(email)
    }

    NewPassword = async(mail, pass)=> {
        return await this.dao.NewPassword(mail, pass)
    }
}