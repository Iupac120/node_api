const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const PORT = process.env.PORT || 3000

const serveFile = async(filePath, contentType, Response) => {
    try{
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image')? 'utf8' : '')
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData
        Response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type': contentType})
        Response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );

    }catch(err){
        console.log(err)
        myEmitter.emit('log', `${err.name}:${err.message}`, 'errLog.txt')
        res.statusCode = 500;
        Response.end();
    }
}

const logEvents = require('./middleware/logEvents')

const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()
myEmitter.on('log',(msg, filename) => logEvents(msg, filename))

// 

// setTimeout(()=>{
//     
// }, 2000)

const server = http.createServer((req,res)=>{
    console.log(req.url, req.method)
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')
    // let path;
    // if (req.url == '/' || req.url == 'index.html'){
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type','index.html')
    //     path = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(path,'utf8',(err, data)=>{
    //         if (err) throw err
    //         res.end(data)
    //     })
    // }
    const extension = path.extname(req.url)

    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css'
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html'
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views','index.html')
            : contentType === 'text/html' && req.url.slice(-1)
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType = 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url )
    // make .html extension not required in the file
    if (!extension && req.url.slice(-1) !== '/') filePath =+ '.html'
    const fileExists = fs.existsSync(filePath)
    if (fileExists){
        // serve the file
        serveFile(filePath, contentType, res)
    }else{
        //404
        //301 redirect 
        switch (path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location':'new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location':'/'});
                res.end();
                break;
            default:
                //serve a 404-page
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
    }
})
server.listen(PORT, ()=>{
    console.log(`Server is listening to port ${PORT}`)
})