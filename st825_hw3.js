var express = require('express');
var bodyparser = require('body-parser');
var request = require('request');
var http = require('http');
var app = express();

app.use(express.static('.'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())

//helper function to calculate the factorial of a number
function fact(num){
	if (num<0)
		return "Not a positive integer";
	else if (num==0)
		return 1;
	else 
		return (num*fact(num-1));
}
app.get('/Fact', function(req, resp){
	var query = req.query.n;			//n is stored in variable query
	var integer = parseInt(query);		//string query is turned into an integer
	console.log(integer);
	total = fact(integer);				//helper function is called here 
	resp.send("Fact value is: " + total);	//respone is sent
	resp.end();
});

//helper function to calculate the summation of a number
function sum(num){
	if (num<0)
		return "Not a positive integer";
	else if (num==0)
		return 0;
	else 
		return (num+sum(num-1));
}
app.get('/summation', function(req, resp){
	var query = req.query.n;				//n is stored in variable query
	var integer = parseInt(query);			//string query is turned into an integer
	console.log(integer);
	total = sum(integer);				//helper function is called here to calculate the integer
	resp.send("Summation value is: " + total);	//response is sent
	resp.end();					
});

app.get('*', function(req, resp){
	resp.redirect("st825_hw3.html")
});
app.listen(8080, function(){
	console.log('Server Started...');
});
