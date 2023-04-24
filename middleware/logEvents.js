// console.log('Hello world');
// //console.log(global);

// const os = require('os');
// const path = require('path')
// const fspromises = require('fs').promises

// const filesops = async() =>{
//     try{
//         const data = await fspromises.readFile(path.join(__dirname,'files','starter.txt'), 'utf8');
//         console.log(data)
//         await fspromises.unlink(path.join(__dirname, 'files','starter.txt'), data)
//         await fspromises.writeFile(path.join(__dirname, 'files','promisewrite.txt'), data)
//         await fspromises.appendFile(path.join(__dirname, 'files','promisewrite.txt'), '\n\nNice to meet you')
//         await fspromises.rename(path.join(__dirname, 'files','promisewrite.txt'),path.join(__dirname,'files','promiserename.txt'))
//         const newdata = await fspromises.readFile(path.join(__dirname,'files','promiserename.txt'),'utf8')
//         console.log(newdata)
//     }catch (err){
//         console.error(err)
//     }
// }

// filesops()
// console.log('Hello....')

// fs.writeFile(path.join(__dirname,'files', 'reply.txt'),'Nice to start again\n', (err)=>{
//     if(err) throw err
//     console.log('write complete')

//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'),'\n\nTesting test',err =>{
//         if (err) throw err
//         console.log('append completed')

//         fs.rename(path.join(__dirname, 'files', 'reply.txt'),path.join(__dirname, 'files','new.txt'),err =>{
//             if (err) throw err
//             console.log('rename completed')
//         })
//     })
// })

//exit on uncaught error
// process.on('uncaughtException', err => {
//     console.error(`There was an uncaught error : ${err}`)
//     process.exit(1)
// })
//const {add, subtract, multiply, divide} = require('./math')

// console.log(add(2,3))
// console.log(subtract(2,3))
// console.log(multiply(2,3))
// console.log(divide(2,3))
// console.log(os.type())
// console.log(os.version())
// console.log(os.homedir())

// console.log(__dirname);
// console.log(__filename)

// console.log(path.dirname(__filename))
// console.log(path.basename(__filename))
// console.log(path.extname(__filename))

// console.log(path.parse(__filename))
const {format} = require('date-fns')
const {v4:uuidv4} = require('uuid')
const uuid = uuidv4()
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async(message, logName) =>{
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid}\t${message}`
    console.log(logItem)
    try{
        if (!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem)
    }catch(err){
        console.error(err)
    }
}
const logger = (req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
    //console.log(`${req.method}${req.path}`)
    next()
}
module.exports = {logger, logEvents}
//console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))
//console.log('hello')