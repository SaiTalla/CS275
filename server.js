var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static("."));

//credentials for server to connect to MYSQL database 
var mysql = require("mysql");
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "cs275"
 });
 con.connect(function(err) {
	if (err) {
		console.log("Error connecting to Database");
		console.log(err);
	}
	else {
		console.log("Database successfully connected");
	}
});

app.get('/displayTable', function (req,res){
	var table_opts = "<select id='option'><option value=''>Select a Table</option><option value='student'>Students</option><option value='course'>Courses</option><option value='grades'>Grades</option></select><button onclick='getTable()'>Get Table</button><br><div><table id='output' border='2' width='100%'></table></div><br>";
	res.send(table_opts);
});

app.get('/getTable', function (req,res) {
	var options = req.query.opt;
	con.query("SELECT * FROM " + options + ";",
		function(err,rows,fields) {
			if (options == 'student') {
				var table = "<tr><th>Student ID</th><th>First Name</th><th>Last Name</th><th>Date of Birth</th><th>Major</th></tr>";
				for (var i=0; i<rows.length; i++){
					table += "<tr><td>"+rows[i].id+"</td><td>"+rows[i].firstname+"</td><td>"+rows[i].lastname+"</td><td>"+rows[i].dateofbirth+"</td><td>"+rows[i].major+"</td></tr>";
				}
				res.send(table);
			}
			else if (options == 'course'){
				var table = "<tr><th>Course ID</th><th>Course Description</th></tr>";
				for (var i=0; i<rows.length; i++){
					table += "<tr><td>"+rows[i].CourseID+"</td><td>"+rows[i].description+"</td></tr>";
				}
				res.send(table);
			}
			else if (options == 'grades') {
				var table = "<tr><th>ID</th><th>Course ID</th><th>Student ID</th><th>Term</th><th>Grade</th></tr>";
				for (var i=0; i<rows.length; i++){
					table += "<tr><td>"+rows[i].id+"</td><td>"+rows[i].CourseID+"</td><td>"+rows[i].StudentID+"</td><td>"+rows[i].Term+"</td><td>"+rows[i].Grade+"</td></tr>";
				}
				res.send(table);
		}
});
});

app.get('/displayTranscript', function(req,res) {
	var trans_opt;
	con.query('SELECT id, firstname, lastname FROM student ORDER BY lastname;', 
		function(err,rows,fields){
			trans_opt = "<select id='s_opt'><option value=''>Select a Name</option>"
			for (var i=0; i<rows.length; i++){
				trans_opt += "<option value='"+ rows[i].id + "'>" + rows[i].lastname + ", " + rows[i].firstname + "</option>";
			}
		}
	);
	con.query('SELECT DISTINCT(Term) FROM grades;', 
		function(err,rows,fields){
			trans_opt += "</select><select id='t_opt'><option value=''>Select a Term</option><option value ='all'>All</option>"
			for (var i=0; i<rows.length; i++){
				trans_opt += "<option value='"+ rows[i].Term + "'>" + rows[i].Term + "</option>";
			}
			trans_opt += "</select><br><button onclick='getTranscript()'>Get Transcript</button><br><div><table id='output' border='2' width='100%'></table></div><br><br>"
			res.send(trans_opt);
		}
	);
});

app.get('/getTranscript', function(req,res) {
	var student = req.query.s_opt;
	var term = req.query.t_opt;
	if (term == 'all'){
		var query = "SELECT student.id, firstname, lastname, Term, course.CourseID, description, Grade FROM course, grades, student WHERE student.id = grades.StudentID AND course.CourseID = grades.CourseID AND student.id=" + student + ";"
	}
	else{
		var query = "SELECT student.id, firstname, lastname, Term, course.CourseID, description, Grade FROM course, grades, student WHERE student.id = grades.StudentID AND course.CourseID = grades.CourseID AND student.id=" + student + " AND term=" + "'" + term + "'" + ";"
	}
	con.query(query,
		function(err,rows,fields) {
			var table = "<tr><th>Student ID</th><th>First Name</th><th>Last Name</th><th>Term/Year</th><th>Course ID</th><th>Description</th><th>Grade</th></tr>";
			for (var i=0; i<rows.length; i++){
				table += "<tr><td>"+rows[i].id+"</td><td>"+rows[i].firstname+"</td><td>"+rows[i].lastname+"</td><td>"+rows[i].Term+"</td><td>"+rows[i].CourseID+"</td><td>"+rows[i].description+"</td><td>"+rows[i].Grade+"</td></tr>";
			}
			res.send(table);
		}
	);
});
app.get('*',function (req, res) {
	res.redirect('./index.html');
});

app.listen(8080,function(){
	console.log('Server Running');
});