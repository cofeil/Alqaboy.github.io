var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var db = require("./database");
var crypto = require('./random.js');
var mail = require('./mail.js');
var robot = require('./robot.js');
var cookieParser = require('cookie-parser');
var rateLimit = require("express-rate-limit");


app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

var limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000000 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);

app.get('/contact', function (req, res) {
	res.render('pages/contact', {});
});
app.get('/despre', function (req, res) {
	res.render('pages/despre', {});
});
app.get('/oferte', function (req, res) {
	db.getAvailableCars().then(function (response) {
		res.render('pages/oferte', {
			masini: response
		});
	}).catch(function (err) {
		console.log(err)
		res.send(err);
	});
});

app.get('/index', function (req, res) {
	res.render('pages/index', {});
});

app.get('/welcome', function (req, res) {
	res.render('pages/welcome_get', {});
});
app.get('/cereri', function (req, res) {
	if (!req.cookies['token']) {
		res.redirect('/logout');
		return;

	}
	db.getAllCereri().then(function (response) {

		res.render('pages/cereri', {
			cereri: response
		});
	}).catch(function (err) {
		console.log(err)
		res.send(err);
	});
});
app.post('/cereri', function (req, res) {
	var data = req.body;

	if (!req.cookies['token']) {
		res.redirect('/logout');
	}
	db.isToken(req.cookies['token']).then(function (response) {
		if (response.length > 0) {
			if (data.action == 'aproba' && data.masina_id && data.cerere_id) {
				db.aprobaCerere(data.cerere_id).then(function (response) {
					var mailOptions = {
						from: 'laurghcof@gmail.com',
						to: data.email,
						subject: 'Rent a Car',
						text: 'Cererea dumneavoastra a fost Aprobata'
					};				
					mail.sendEmail(mailOptions);

					robot.start();
					res.send({ message: 'aprobat' });

				}).catch(function (err) {
					res.send({ message: 'error' });
				});
			} else if (data.action == 'respinge') {
				robot.start();
				db.refuzaCerere(data.cerere_id).then(function (response) {
					res.send({ message: 'respins' });
				}).catch(function (err) {
					res.send({ message: 'error' });
				});
			} else if (data.action == 'sterge') {
				robot.start();
				db.stergeCerere(data.cerere_id).then(function (response) {
				
					res.send({ message: 'sters' });
				}).catch(function (err) {
					res.send({ message: 'error' });
				});
			} else {
				res.send({ message: 'error' });
			}
		}
	}).catch(function (err) {
		console.log(err)
		res.send(err);
	});
});

app.get('/login', function (req, res) {
	res.render('pages/login', {});
});
app.get('/register', function (req, res) {

	if (!req.cookies['token']) {
		res.redirect('/logout');
	}
	db.isToken(req.cookies['token']).then(function (response) {
		if (response.length > 0) {
			res.render('pages/register', {});
		}
	}).catch(function (err) {
		console.log(err)
		res.send(err);
	});

});


app.post('/register', function (req, res) {
	var data = req.body;
	data.status_id = 1;
	data.password = crypto.createHash(data.password);

	db.insert("users", data).then(function (response2) {
		res.send({ message: 'done' });
	}).catch(function (err) {
		console.log(err)
		res.send({ message: 'error' });
	});

})


app.post('/login', function (req, res) {
	var data = req.body;
	data.pass = crypto.createHash(data.pass);

	db.checkIfUserExist(data.email, data.pass).then(function (response) {

		if (response.length > 0) {
			var token = crypto.createToken();

			db.createToken(token, response[0].id).then(function (response2) {

				res.cookie('token', token, { maxAge:  1000 * 60 * 60 * 8, httpOnly: true });
				res.send({ ok: true, token: token, email: data.email });
			}).catch(function (error) { console.log(error) });
		}
	}).catch(function (error) {
		console.log(error);
		res.send({ ok: false });
	});
})
app.get('/logout', function (req, res) {
	res.clearCookie('token');
	//db.deleteToken(response2[0].id).then(function( response3  ) {});
	res.render('pages/logout', {});
});


app.get('/cars/all', function (req, res) {

	db.getCars().then(function (response) {
		res.send(response);
	}).catch(function (err) {
		console.log(err)
		res.send(err);
	});
});


app.post('/reserva', function (req, res) {
	var data = req.body;
	data.status_id = 9;
	
	var start = new Date(data.perioadapredare);
	var end = new Date(data.perioadaridicare);

	if ( start.getTime() < new Date().getTime() &&  start.getTime() <= end.getTime() ){
		res.send("Error");
	}else{
		db.insert('cerere', data).then(function (response) {
			res.render('pages/welcome_get', {});
		}).catch(function (error) {
			console.log(error);
			res.send({ ok: "-1" });
		});
	}
});

app.get('/reserva', function (req, res) {

	db.getCar(req.query.id).then(function (response) {
		res.render('pages/formular', {
			masina: response
		});
	}).catch(function (err) {
		console.log(err)
		res.send(err);
	});

});

// Test Node rate limiter
// app.get('/testApi', function (req, res) {
// 	res.send('TEST');	
// });

// countdown then runs
setInterval(function(){
	robot.start();
//run for a day
}, 1000 * 60 * 60 * 24);

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});