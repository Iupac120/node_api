const userDB = {
    users: require('../model/user.json'),
    setUsers: function (data){this.users = data}
}

const fspromises = require('fs').promises
const path = require('path')

const handleLogOut = async(req, res) =>{
    // on the client side, delete the access token
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //no content
    const refreshToken = cookies.jwt
    //is the refreshtoken on the data base
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser){
        //If cookies is found but the user not found
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        return res.sendStatus(204)//successful but no content
    }
    //delete refreshtoken in database
    const otherUsers = userDB.users.filter(persons => persons.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    userDB.setUsers([...otherUsers, currentUser])
    await fspromises.writeFile(path.join(__dirname, '..', 'model', 'user.json'), JSON.stringify(userDB.users))
    res.clearCookie('jwt', {httpOnly: true, samesite:'none', secure: true})//secure true 
    res.status(201).json({"message":"You are logged out"})
}

module.exports = {handleLogOut}