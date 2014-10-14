var http = require('http');
var _ = require('underscore');
var database = {users: {hari:0}, 
                numberOfusers: 0, 
                chirp:{0:[{id:0, chirpText: 'fua'},
                          {id:1, chirpText: 'fuass'}]},
                numberOfchirps: 1};
http.createServer(function (req, res) {
  var params = '';
  req.on('data', function(chunk) {
        params += chunk;
  });
  console.log(req.url);
  if(req.method === 'GET'){
    if(req.url.indexOf('/all_chirps') > -1) {

      req.on('end', function() {
        var all_chirps =[];
         _.each(database.chirp,function(chirpObj){
          _.each(chirpObj,function(singleChirp){
            all_chirps.push(singleChirp);  
          });
        });

        all_chirps = JSON.stringify(all_chirps);
        // empty 200 OK response for now
        res.writeHead(200, "OK", {'Content-Type': 'application/json'});
        res.end(all_chirps);
      });
    }
    else if(req.url.indexOf('/chirps') > -1) {
      req.on('end', function() {
        params = JSON.parse(params);

        if(params.userId){
          console.log(params, (database.chirp[params.userId]))
          var all_chirps = JSON.stringify(database.chirp[params.userId]);
          res.writeHead(200, "OK", {'Content-Type': 'application/json'});
          res.end(all_chirps);
        }else if(params.chirpId){
            var theChirp;
            _.each(database.chirp,function(usersChirps){
              _.each(usersChirps, function(chirp){
                if(chirp.id = params.chirpId){
                  theChirp = chirp;
                }
              });
            });
            if(theChirp){
              theChirp = JSON.stringify(theChirp);
              res.writeHead(200, "OK", {'Content-Type': 'application/json'});
              res.end(theChirp);
            }else{
              res.writeHead(403, "FORBIDDEN", {'Content-Type': 'application/json'});
              res.end();
            }
          return;
        }

        

        res.writeHead(403, "FORBIDDEN", {'Content-Type': 'application/json'});
        res.end();
      });
    }
    

      
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