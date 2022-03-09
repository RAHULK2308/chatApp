const express =require('express');
const path = require('path');
const http =require('http');
const socketio= require('socket.io');
const generateMsg=require('./src/utlis/message')


const app =  express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000;

const public=path.join(__dirname,'./public');

app.use(express.static(public));


//listening user connection
io.on('connection',(socket)=>{
    console.log('new  connection');
    socket.emit('message',generateMsg('Admin','Welcome'));

    socket.on('usermessage',({username,message},callback)=>{

        io.emit('message',generateMsg(username,message));
        callback()
    })
//listning user disconnecting
socket.on('disconnect',()=>{
     //emiting user disconnecting msg
     io.emit('message',generateMsg('Admin',` user is disconnected`))
})
})

server.listen(port,()=>{
    console.log(`server is on port ${port}`)
})