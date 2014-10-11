var http = require('http');
var database = {users: {hari:0}, 
                numberOfusers: 0, 
                chirp:{0:[{id:0, chirpText: 'fua'},
                          {id:1, chirpText: 'fuass'}]},
                numberOfchirps: 1};
http.createServer(function (req, res) {
  console.log(req.url);
  console.log(req.method);
  var params = '';
  req.on('data', function(chunk) {
        
        params += chunk;
  });

  if(req.method === 'GET'){
    

    req.on('end', function() {
        // empty 200 OK response for now
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(req.url);
    });  
  }else if(req.method === 'POST'){
    if(req.url.indexOf('/register') > -1) {
      req.on('end', function() {
        params = JSON.parse(params);

        if(!params.user){
          res.writeHead(409, "NOT OK", {'Content-Type': 'application/json'});
          res.end(req.url);
        }

        if(database.users[params.user]){
          res.writeHead(409, "NOT OK - User already created", {'Content-Type': 'application/application/json'});
          res.end('Problem ');  
        }

        database.users[params.user] = database.numberOfusers + 1;
        database.numberOfusers += 1;
        // empty 200 OK response for now
        var responseObject = {key: database.users[params.user]} 
        responseObject = JSON.stringify(responseObject);
        
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(responseObject);
      });
    }else if(req.url.indexOf('/chirp') > -1){
      req.on('end', function() {
        params = JSON.parse(params);
        
        if(database.users[params.user] != params.key){
          res.writeHead(403, "FORBIDDEN", {'Content-Type': 'application/json'});
          res.end('Wrong key');  
        }

        if(!database.chirp[params.key]){
          database.chirp[params.key] = [];
        }
        var newChirp = {id: database.numberOfchirps + 1, text:params.chirpText};

        database.chirp[params.key].push(newChirp);
        database.numberOfchirps +=1;

        // empty 200 OK response for now
        var responseObject = {chirpId: newChirp.id};
        responseObject = JSON.stringify(responseObject);
        
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(responseObject);
      });
    }
  }else if(req.method === 'DELETE') {
    if(req.url.indexOf('/chirp') > -1){
      req.on('end', function() {
        params = JSON.parse(params);
                
        database.chirp[params.key] = database.chirp[params.key].filter(function(chirp){
          return chirp.id != params.chirpId; 
        })

        // empty 200 OK response for now
        var responseObject = {} 
        responseObject = JSON.stringify(responseObject);
        
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(responseObject);
      });
    }
  }
}).listen(9615);