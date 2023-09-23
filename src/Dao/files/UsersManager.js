import fs from 'fs';

export default class user{
    #path = undefined;
    constructor() {
        if (!fs.existsSync("./users.json")){
            fs.writeFileSync("./users.json", JSON.stringify([]));
        }
        this.#path = "./users.json"
    }
}