require("dotenv").config()

const config = ()=> {
    return {
        dbpath: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        jwt_secret: process.env.KEY_JWT,
        jwt_expire: "2d",
        bcrypt_salt: 10
    }
}

module.exports = config()