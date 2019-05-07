const localIPAdress = "10.3.3.21"
//192.168.0.16
//10.3.3.21

export default {
    NODE_ENV: "prod",
    LOCAL_API_URL_REGISTER: `http://${localIPAdress}:3000/api/auth/register`,
    HEROKU_API_URL_REGISTER: "https://gathergamers.herokuapp.com/api/auth/register",
    LOCAL_API_URL_LOGIN: `http://${localIPAdress}:3000/api/auth/login`,
    HEROKU_API_URL_LOGIN: "https://gathergamers.herokuapp.com/api/auth/login"    
}