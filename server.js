const http = require('http'); 
const url = require('url')  
const fs = require('fs'); 

const port = 8080; 


const headers = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Headers': '*', 
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE', 
    'Access-Control-Max-Age': 2592000, // 30 days
  };  


const handleRequest=function(req,res){ 
    if (req.method === 'GET') 
        return handleGetReq(req, res)
     else if (req.method === 'POST') 
        return handlePostReq(req, res)
    else if (req.method === 'DELETE') 
        return handleDeleteReq(req, res)
    else if(req.method=='OPTIONS')
        return handleOptions(req,res)

}


function handleOptions(req, res) { 
    res.writeHead(204, headers);  
    res.end(); 
}


function handleGetReq(req, res) {  
    const { pathname } = url.parse(req.url) 
    const elements=pathname.split('/')
    const userName =elements[2];
    fs.readFile('./'+ userName+  '/data.txt', 'utf8', function(err, data){  
        var posts 
        if(data==undefined){
            posts=[] 
        }
        else{
            var j=JSON.parse(data); 
            posts=j.posts; 
        }
            
        res.setHeader('Content-Type', 'application/json'); 

        res.writeHead(200, headers); 
        res.end(JSON.stringify(posts)) 
    
    }); 
      

    
}

function handlePostReq(req, res) { 
    const { pathname } = url.parse(req.url)
    const elements=pathname.split('/')
    const userName =elements[2] 

    const size = parseInt(req.headers['content-length'], 10) 
    const buffer = Buffer.allocUnsafe(size) 
    var pos = 0

    req 
    .on('data', (chunk) => { 
      const offset = pos + chunk.length 
      if (offset > size) { 
        reject(413, 'Too Large', res) 
        return 
      } 
      chunk.copy(buffer, pos) 
      pos = offset 
    }) 
    .on('end', () => { 
      if (pos !== size) { 
        reject(400, 'Bad Request', res) 
        return  
      } 
      const post = JSON.parse(buffer.toString()) 
      fs.readFile('./'+ userName+  '/data.txt', 'utf8', function(err, data){
        var j
        if(data==undefined){ 
            fs.mkdirSync('./'+ userName); 
            j = {}
            j.idCounter=0;
            j.posts=[];
        }
        else{
            j=JSON.parse(data); 
        }
        j.idCounter++; //incrementare
        post.id=j.idCounter;
        post.data=new Date().toLocaleString()
        j.posts.push(post);
        fs.writeFileSync('./'+ userName+  '/data.txt', JSON.stringify(j));  
        

        res.writeHead(200, headers); 
        res.end("OK")  
    }); 
   
    
    })
}

function handleDeleteReq(req, res) { 
    const { pathname } = url.parse(req.url)
    const elements=pathname.split('/')
    const userName =elements[2]

    const id = parseInt(elements[4])

    fs.readFile('./'+ userName+  '/data.txt', 'utf8', function(err, data){
        var j
        if(data==undefined){
            res.writeHead(404, headers); 
            res.end();
        }
        else {
            j=JSON.parse(data);  
            var newPost = []; 
            for(var p of j.posts) {
                if(p.id !== id) {
                    newPost.push(p);
                }
            }
            j.posts = newPost; 
            fs.writeFileSync('./'+ userName+  '/data.txt', JSON.stringify(j)); 

            res.writeHead(200, headers); 
            res.end("OK") 

        }
             
    }); 

}
const server = http.createServer(handleRequest) 
    
server.listen(port, () => {
    console.log(`Server listening on port ${port}`); 
})

