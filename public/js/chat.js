const socket =io();

//Elements form
const $msgForm=document.querySelector('#messageform');
const $msgInput=$msgForm.querySelector('input');
const $msgButton=$msgForm.querySelector('button');


//messages
const $msgs=document.querySelector('#messages');
// templates
const messageTemplate=document.querySelector('#message-template').innerHTML

//parsing name and room parameters from the location.search using qs library
const {username}=Qs.parse(location.search,{ignoreQueryPrefix:true})


//function for auto scolling
const autoscolling = ()=>{
    //new msg element
    const $newMessage=$msgs.lastElementChild;
   //height of the new message
     const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
   //visible height
   const visibleHeight=$msgs.offsetHeight

   //height of messages container
   const containerHeight=$msgs.scrollHeight

   //how far have i scrolled
   const scrollOffset=$msgs.scrollTop+visibleHeight

   if(containerHeight-newMessageHeight<=scrollOffset){
    $msgs.scrollTop=$msgs.scrollHeight
   }


}




//listening msg from the server
socket.on('message',(msg)=>{
    
    console.log(msg)
    //rendering dynamic template using Mustache libery
    const html=Mustache.render(messageTemplate,{
        username:msg.username,
        msg:msg.text,
        time:moment(msg.createdAt).format('h:mma')
    });
    $msgs.insertAdjacentHTML('beforeend',html)
    autoscolling()
})

socket.emit('join',{username},(error)=>{
    if(error){
        alert(error)
        location.href='/';
    }
})




//sending msg from the user to the server
document.querySelector('#messageform').addEventListener('submit',(e)=>{
e.preventDefault()

// disabling  button after sending msg
$msgButton.setAttribute('disabled','true')
message=e.target.elements.usermsg.value



socket.emit('usermessage',{message,username},(err)=>{
    //enabling button before sending msg
    $msgButton.removeAttribute('disabled','true');
    $msgInput.value='';
    $msgInput.focus();

    //checking Profanity of a message 
    if(err){
       return console.log(err);
    }
    console.log('msg delivered');
})


})




//pratice section

// socket.on('updateCount',(count)=>{
// console.log('user update',count)
// })

// document.querySelector('#increament').addEventListener('click',()=>{
//     console.log('clicked');
//     socket.emit('increament')
// })