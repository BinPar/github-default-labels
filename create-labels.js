#!/usr/bin/env node
'use strict';

let request = require('request');
let defaultLabels = require('./default-labels.json');
let prompt = require('prompt');

const GIT_API_URL = 'https://api.github.com/repos/';

let schema = {
	properties: {
		repositoryName: {
			description: 'GitHub repository name: ',
			required: true
		},
		repositoryOwner: {
			description: 'GitHub repository owner: ',
			required: true
		},
		username: {
			description: 'GitHub auth user: ',
			required: true
		},
		password: {
			description: 'GitHub auth password: ',
			hidden: true,
			replace: '*'
		}
	}
};

prompt.message = '';
prompt.delimiter = '';

prompt.start();

prompt.get(schema, function (err, result) {
	if(err){
		console.log('ERROR: ', err);
	}
	else{
		let auth = {
			user: result.username,
			pass: result.password
		};
		let url = `${GIT_API_URL}${result.repositoryOwner}/${result.repositoryName}/labels`;
		for(let i = 0, l = defaultLabels.length; i < l; i++) {
			let label = defaultLabels[i];
			request.post(url, {
				body: label,
				json: true,
				auth: auth,
				headers: {
					'User-Agent': 'GitHub-Create-Default-Labels_v0.0.1'
				}
			}, function (err, res) {
				if(err) {
					console.log('ERR: ', err);
				}
				else{
					console.log(`* ${label.name}: `, `Status: ${res.statusCode}\r\nStatus message: ${res.statusMessage}\r\nbody: ${JSON.stringify(res.body)}\r\n\r\n`);
				}
			});
		}
	}
});
