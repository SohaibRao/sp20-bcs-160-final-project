const fs = require('fs');

    
if (url === "/") {
    res.write("<html>");
    res.write("<head><title>My first page</title><head>");
    res.write("<body><form action='/message' method='POST' ><input type='text'></input><button type='submit'>send</button></form></body>");
    res.write("</html>");
    return res.end(); 
  }

  //redirection example
  if(url === '/message' && method ==='POST'){
    let body= [];
    req.on('data',(chunk)=>{
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log(chunk);
        body.push(chunk);

    })
    
    req.on('end',()=>{
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody);
        const msg = parsedBody.split('=')[1];
        console.log("data is************************************  ", msg)
        fs.writeFile('message.txt', msg, err =>{
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    });
  
   
  }

  res.write("<html>");
  res.write("<head><title>My first server</title><head>");
  res.write("<body><h1>Hellow from Sohaib</h1></body>");
  res.write("</html>");
  res.end();
  if (url === "/") {
      res.write("<html>");
      res.write("<head><title>My first page</title><head>");
      res.write("<body><form action='/message' method='POST' ><input type='text'></input><button type='submit'>send</button></form></body>");
      res.write("</html>");
      return res.end(); 
    }
  
    //redirection example
    if(url === '/message' && method ==='POST'){
      let body= [];
      req.on('data',(chunk)=>{
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
          console.log(chunk);
          body.push(chunk);
  
      })
      
      req.on('end',()=>{
          const parsedBody = Buffer.concat(body).toString();
          console.log(parsedBody);
          const msg = parsedBody.split('=')[1];
          console.log("data is************************************  ", msg)
          fs.writeFile('message.txt', msg, err =>{
              res.statusCode = 302;
              res.setHeader('Location', '/');
              return res.end();
          });
      });
    
     
    }
  
    res.write("<html>");
    res.write("<head><title>My first server</title><head>");
    res.write("<body><h1>Hellow from Sohaib</h1></body>");
    res.write("</html>");
    res.end();


