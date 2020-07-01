'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3974;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://depeche:udI8FyTlq4I1gJFH@cluster0-n8nwk.mongodb.net/enjoy',(err, res) => {
	if (err) {
		throw err;
	}else{
		console.log("esta bien la conexcion");
        
        app.listen(port ,function(){
            console.log("SERVIDOR LISTO EN EL PUERTO https://localhost:"+port);
        });
	}
}
	);



