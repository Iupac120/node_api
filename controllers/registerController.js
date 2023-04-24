const userDB = {
    users: require('../model/user.json'),
    setUsers: function (data){this.users = data}
}

const fspromise = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async(req,res)=>{
    const {user, pwd} = req.body
    if (!user || !pwd) return res.status(400).json({"message":"Username and password are required"})
    //check for duplicate
    const duplicate = userDB.users.find(person => person.username === user)
    if (duplicate) return res.sendStatus(409)//conflict
    try{
        //encrypt password
        const hashpwd = await bcrypt.hash(pwd, 10)
        //store new user
        const newUser = {
            "username": user,
            "roles":{
                "User": 2001
            },
            "password": hashpwd
        }
        userDB.setUsers([...userDB.users, newUser])
        await fspromise.writeFile(path.join(__dirname, '..', 'model', 'user.json'),
        JSON.stringify(userDB.users))
        console.log(userDB.users)
        res.status(201).json({"success":`New user ${user} created`})
    }catch(err){
        console.error(err.message)
        res.status(500).json({"message":err.message})
    }

}

module.exports = {handleNewUser}