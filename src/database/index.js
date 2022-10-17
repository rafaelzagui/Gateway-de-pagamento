import moongose from "mongoose"

import config from '../config/dataBase'

class Database{
    constructor(){
        this.connection = moongose.connect(config.url,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
    }
}

export default new Database();