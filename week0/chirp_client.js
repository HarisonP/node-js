#!/usr/bin/env node
'use strict';

var http = require("http");
var request = require('request');


function takeArguments(){
	var ArgumentParser = require('argparse').ArgumentParser;
	var parser = new ArgumentParser({
	  version: '0.0.1',
	  addHelp:true,
	  description: 'Argparse example'
	});

	parser.addArgument(
	   ['--register'],
	   {action:'storeTrue'}
	);

	parser.addArgument(
	   ['--user']
	)

	parser.addArgument(
	   ['--addChirp'],
	   {action:'storeTrue'}
	);
	
	parser.addArgument(
	   ['--delChirp'],
	   {action:'storeTrue'}
	);

	parser.addArgument(
	   ['--key']
	);

	parser.addArgument(
	   ['--userId']
	);

	parser.addArgument(
	   ['--chirpText']
	);

	parser.addArgument(
	   ['--chirpId']
	);
	parser.addArgument(
	   ['--allChirps'],
	   {action:'storeTrue'} 
	);

	var args = parser.parseArgs();
	return args;
}

var args = takeArguments();

console.log(args)
if (args.register) {
	request({
			method:'POST',
			uri:"http://localhost:9615/register",
			json:{user:args.user}},
	 		function(err,res,body) {
	 			key = body.key;
				console.log(body);
			}
	);	
}else if(args.addChirp){
	request({
		method:'POST',
		uri:"http://localhost:9615/chirp",
		json:{user:args.user, key: args.key}},
 		function(err,res,body) {
			console.log(body);
		}
	);
}else if(args.delChirp){
	request({
		method:'DELETE',
		uri:"http://localhost:9615/chirp",
		json:{key: args.key, chirpId: args.chirpId}},
 		function(err,res,body) {
			console.log(body);
		}
	);
}else if(args.allChirps){
	request({
		method:'GET',
		uri:"http://localhost:9615/all_chirps",
		json:{key: args.key, chirpId: args.chirpId}},
 		function(err,res,body) {
			console.log(body);
		}
	);
}else if(args.chirpId || args.userId){
	request({
		method:'GET',
		uri:"http://localhost:9615/chirps",
		json:{userId: args.userId, chirpId: args.chirpId}},
 		function(err,res,body) {
			console.log(body);
		}
	);
}
