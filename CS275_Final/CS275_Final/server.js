var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("."));

var mysql = require("mysql");
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "foodtruck"
 });
con.connect(function(err) {
	if (err) {
		console.log("Error connecting to Database");
	}
	else {
		console.log("Database successfully connected");
	}
});

app.post('/addtruck', function (req,res) {
  var name = req.body.name;
  var location = req.body.location;
  var rating = req.body.rating;
  var cuisine = req.body.cuisine;
	var favfood = req.body.favfood;
	var id;
  con.query("SELECT Name, Location, Rating, Cuisine, images FROM Trucks WHERE name = '" + name + "' AND location = '" + location + "' AND rating = '" + rating + "' AND cuisine = '" + cuisine + "'AND images = '" + name + ".jpeg';",
      function(err, rows, result) {
        if(err){
          res.send('Error querying MYSQL Database');
        }
        else if (rows.length>0){
          res.send('Error: Truck already exists in database');
        }
        else {
          con.query("INSERT INTO Trucks(Name,Location,Rating,Cuisine, images) VALUES('"+name+"', '"+location+"', '"+rating+"', '"+cuisine+"', '"+name+".jpeg"+"');",
          function(err,result){
            if(err){
              res.send('Error querying database');
            }
            else{  //res.send('Added truck to database');

            }
						con.query("SELECT Truck_Id from Trucks WHERE Name = '" + name + "';",
						function(err,rows) {
							if(err){
								res.send('Error');
							}
							else if (rows.length>0){
								for (var i = 0; i < rows.length; i++) {
									id = rows[i].Truck_Id;
								}
								var vote = 1;
								console.log(id);
									var check = con.query("INSERT INTO Foods(Food_name,Vote,Truck_Id) VALUES('"+favfood+"','" +vote+"' ,'"+id+"');",
										function(err,result){
											if(err){
												console.log(check);
												res.send('Error inserting food into database');
											}
											else{
												console.log("i am in the food section");
												res.send('Added favorite food into food database')
											}
										}
								)

							}

							}
					)

          })

        //)
        }
        }
)
});
//addtruck ends

app.get('/populate_truck',function(req,res){
  console.log("in populate truck")
  con.query("SELECT Name FROM TRUCKS ORDER BY Name",function (err,rows,fields){
    if(err)
      console.log("An Error occured during populating truck dropdown")
      else {
        var html_string;
        for (var i=0;i<rows.length;i++){
          html_string += "<option>"+rows[i].Name+"</option>"
        }
        res.send(html_string);
      }
  });

});
app.get('/populate_food',function(req,res){
  console.log("in populate food")
  con.query("SELECT trucks.name, foods.food_name FROM FOODS inner JOIN trucks on foods.truck_id = TRUCKS.truck_id ",function (err,rows,fields){
    if(err)
      console.log("An Error occured during populating food dropdown");
      else {
        var html_string;
        for (var i=0;i<rows.length;i++){
					console.log(rows);
          html_string += "<option>"+rows[i].name+":"+rows[i].food_name+"</option>"
        }
        res.send(html_string);
      }
  });

});

app.post('/new_food',function(req,res){
	console.log("in add food");
  var food  = req.body.food_name;
	var truck = req.body.truck_name;
	//console.log(food);
	con.query("SELECT Truck_Id from Trucks WHERE Name = '" + truck + "';",
	function(err,rows) {
		if(err){
			res.send('Error');
		}
		else if (rows.length>0){
			for (var i = 0; i < rows.length; i++) {
				id = rows[i].Truck_Id;
			}
			var vote = 1;
			console.log(id);
				var check = con.query("INSERT INTO Foods(Food_name,Vote,Truck_Id) VALUES('"+food+"','" +vote+"' ,'"+id+"');",
					function(err,result){
						if(err){
							console.log(check);
							res.send('Error inserting food into database');
						}
						else{
							console.log("i am in the food section");
							res.send('Added food ')
						}
					});
		}
		});

});

app.post('/vote',function(req,res){
	console.log("in populate vote");
	console.log(req.body.foods);
  var food  = req.body.foods
	console.log(food);

  var check = con.query("UPDATE foods set vote=vote+1 where food_name="+"'"+food+"';",function (err,rows,fields){
    if(err)
      console.log("An Error occured during populating food dropdown");
      else {
				console.log(check);
				res.send("Congrats!!! you voted");
        }
  });

});
app.get('/all_trucks',function (req, res) {
	//res.redirect('./home.html');
	con.query("SELECT Name,Location,Rating,Cuisine,images,foods.Food_name,foods.vote FROM TRUCKS,foods where trucks.truck_id=foods.truck_id ORDER BY rating DESC;", function (err,rows,fields){
		if(err)
		console.log("Error during query processing");
		else{

			var html_string  = "<table class=\"table table-dark\"> <thead> <tr> <th scope=\"col\">#</th> <th scope=\"col\">Images</th> <th scope=\"col\">Name</th> <th scope=\"col\">Location</th> <th scope=\"col\">Rating</th> <th scope=\"col\">Cuisine</th> <th scope=\"col\">Food</th><th scope=\"col\">Votes</th></tr></thead><tbody>"
			for (var i=0;i<rows.length;i++){
				//console.log(rows)
				html_string += "<tr><th class = \"text-center\" scope=\"row\">" + (i+1) + "</th><td class=\"align-middle\">" + "<img src="+rows[i].images+ " height=175px width=275>" + "</td><td class=\"align-middle\">"+ rows[i].Name + "</td><td class=\"align-middle\">" + rows[i].Location + "</td><td class=\"align-middle\">" + rows[i].Rating + "</td><td class=\"align-middle\">" + rows[i].Cuisine + "</td><td class=\"align-middle\">" + rows[i].Food_name +"</td><td class=\"align-middle\">" + rows[i].vote +" </td></tr>"
			}
			html_string +=   "</tbody></table>"
			//var html_string  = "<table class=\"table\"> <thead> <tr> <th scope=\"col\">#</th> <th scope=\"col\">Name</th><th scope=\"col\">Location</th><th scope=\"col\">Rating</th><th scope=\"col\">Cuisine</th></tr></thead><tbody>"
			//var tab = "<tr><th>Name</th><th>Location</th><th>Rating</th><th>Cuisine</th><th>Course ID</th></tr>";
			//for (var i=0;i<3;i++){
				//tab += "<tr><td"+rows[i].Name + "</td><td>" + rows[i].Location + "</td><td>" + rows[i].Rating + "</td><td>" + rows[i].Cuisine + "</td></tr>";
			//}
			//console.log(tab)
			//console.log(err);
			res.send(html_string);
			//res.end();
		}


	});
});

app.get('/home',function (req, res) {
	//res.redirect('./home.html');
	con.query("SELECT Name,Location,Rating,Cuisine,images FROM TRUCKS ORDER BY Rating DESC", function (err,rows,fields){
		if(err)
		console.log("Error during query processing");
		else{

			var html_string  = "<table class=\"table table-dark\"> <thead> <tr> <th scope=\"col\">#</th><th scope=\"col\">Images</th> <th scope=\"col\">Name</th><th scope=\"col\">Location</th><th scope=\"col\">Rating</th><th scope=\"col\">Cuisine</th></tr></thead><tbody>"
			for (var i=0;i<3;i++){
				//console.log(rows)
				html_string += "<tr><th class = \"text-center\" scope=\"row\">" + (i+1) + "</th><td class=\"align-middle\">" + "<img src="+rows[i].images+ " height=175px width=275>" + "</td><td class=\"align-middle\">"+ rows[i].Name + "</td><td class=\"align-middle\">" + rows[i].Location + "</td><td class=\"align-middle\">" + rows[i].Rating + "</td><td class=\"align-middle\">" + rows[i].Cuisine + "</td></tr>"
			}
			html_string +=   "</tbody></table>"
			//var html_string  = "<table class=\"table\"> <thead> <tr> <th scope=\"col\">#</th> <th scope=\"col\">Name</th><th scope=\"col\">Location</th><th scope=\"col\">Rating</th><th scope=\"col\">Cuisine</th></tr></thead><tbody>"
			//var tab = "<tr><th>Name</th><th>Location</th><th>Rating</th><th>Cuisine</th><th>Course ID</th></tr>";
			//for (var i=0;i<3;i++){
				//tab += "<tr><td"+rows[i].Name + "</td><td>" + rows[i].Location + "</td><td>" + rows[i].Rating + "</td><td>" + rows[i].Cuisine + "</td></tr>";
			//}
			//console.log(tab)
			//console.log(err);
			res.send(html_string);
			//res.end();
		}


	});
});

app.get('*',function (req, res) {
	res.redirect('./home.html');
});

app.listen(8080,function(){
	console.log('Server Running');
});
