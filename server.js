import http from 'http'
import { readFileSync, writeFileSync } from 'fs'
import { lastId } from './utility/lastid.js'
import dotenv from 'dotenv'
dotenv.config()

// DATA READ
const studentsJson =  readFileSync('./db.json')
const students = JSON.parse(studentsJson)

http.createServer((req,res) => {
    if( req.url == '/api/students' && req.method == 'GET'){
        res.writeHead( 200 , {'Content-type' : 'application/json'})
        res.end(studentsJson)
    }else if( req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method == 'GET'){
        let id = req.url.split('/')[3]
      
        if(students.some( data => data.id == id)){
            let data = students.find( data => data.id == id )
            res.writeHead( 200 , {'Content-type' : 'application/json'})
            res.end(JSON.stringify(data))  
        }else{
            res.writeHead( 200 , {'Content-type' : 'application/json'})
            res.end(JSON.stringify({
                message : 'Not Found'
             }))  
        }
        res.writeHead( 200 , {'Content-type' : 'application/json'})
        res.end(JSON.stringify(data))
    }else if( req.url == '/api/students' && req.method == 'POST'){
        let data = ''
        req.on('data' , (chunk) => {
           data += chunk.toString();
        })
        req.on('end' , () => {
            let pushData = JSON.parse(data)
            students.push({
                id : lastId(students),
                ...pushData
            })
          writeFileSync('./db.json' , JSON.stringify( students))
        })

        res.writeHead( 200 , {'Content-type' : 'application/json'})
        res.end(JSON.stringify({
            message : 'Post Okay'
        }))
    }else if(req.url.match(/api\/students\/[0-9]{1,}/) && req.method == 'DELETE'){
       let id = req.url.split('/')[3]

       if(students.some( data => data.id == id)){
        let afterDelete = JSON.stringify(students.filter( data => data.id != id))
        writeFileSync('./db.json', afterDelete )
       }
    
       res.writeHead( 200 , {'Content-type' : 'application/json'})
       res.write(JSON.stringify({
           message : 'Deleted' 
       }))
       res.end()
    }else if(req.url.match(/api\/students\/[0-9]{1,}/) && req.method == 'PATCH' || req.url.match(/api\/students\/[0-9]{1,}/) && req.method == 'PUT'){
       
        let id = req.url.split('/')[3]

        if(students.some( data => data.id == id)){

           let editdata = ''
           req.on('data', chunk => {
               editdata = JSON.parse(chunk.toString())
           })
           req.on('end' , () => {
              let index = students.findIndex( data => data.id == id)
              students[index] = {id : id, ...editdata}
              writeFileSync('./db.json', JSON.stringify(students) )
           })
        }
       
       res.writeHead( 200 , {'Content-type' : 'application/json'})
       res.write(JSON.stringify({
           message : 'Edit' 
       }))
       res.end()
    }
     else{
        res.writeHead( 200 , {'Content-type' : 'application/json'})
        res.end(JSON.stringify({
            message : 'Something went wrong!'
        })) 
    }
   
}).listen( process.env.SERVER_PORT , () => {
     console.log(process.env.APP_NAME + ' Is Running on ' + process.env.SERVER_PORT + ' port');
})  


 




