const userDB = {
    users: require('../model/user.json'),
    setUsers: function (data){this.users = data}
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fspromises = require('fs').promises
const path = require('path')

const handleLogin = async (req,res) => {
    const {user, pwd} = req.body
    if (!user || !pwd) return res.status(400).json({"message":"Username and Password are required"})
    const foundUser = userDB.users.find(person => person.username === user)
    if (!foundUser) return res.sendStatus(401) //unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match){
        //create roles for users
        const roles = Object.values(foundUser.roles)
        //create JWT
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "username": foundUser.username,
                    "roles":roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'30d'}
        )
        const refreshToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'40d'}
        )
        const otherUsers = userDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken};
        userDB.setUsers([...otherUsers, currentUser]);
        console.log(userDB.users)
        await fspromises.writeFile(path.join(__dirname, '..', 'model', 'user.json'), JSON.stringify(userDB.users))
        res.cookie('jwt', refreshToken)
        res.status(201).json({accessToken})
    }else {
        res.sendStatus(401)
    }
}

module.exports = {handleLogin}