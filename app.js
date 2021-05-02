var http = require('http'), //This module provides the HTTP server functionalities
    path = require('path'), //The path module provides utilities for working with file and directory paths
    express = require('express'), //This module allows this app to respond to HTTP Requests, defines the routing and renders back the required content
    fs = require('fs'), //This module allows to work witht the file system: read and write files back
    xmlParse = require('xslt-processor').xmlParse, //This module allows us to work with XML files
    xsltProcess = require('xslt-processor').xsltProcess; //The same module allows us to utilise XSL Transformations
    xml2js = require('xml2js'); //This module does XML to JSON conversion and also allows us to get from JSON back to XML

var router = express(); //We set our routing to be handled by Express
var server = http.createServer(router); //This is where our server gets created

// const dotenv = require("dotenv");
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load() // this is going to load all the variables in the .env file and it's going to import the process env variable into my app
// }
//const express = require('express')
require('dotenv').config()
const app = express()
// const dotenv = require("dotenv");
// dotenv.config();

const mongoose = require('mongoose')
const dbURI = process.env.DB_URL;
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use(express.json())

// axios = require('axios'),
// const logger = require('morgan'),
//cors = require('cors'),
// express = require('express'),
// bodyParser = require('body-parser'),
// dotenv = require("dotenv");
// dotenv.config();

// const app = express()
// const expressLayouts = require('express-ejs-layouts')

// const indexRouter = require('./routes.js')

// app.set('view engine', 'ejs')
// app.set('views', __dirname + '/views')
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)
// app.use(express.static('public'))
// app.use(bodyParser.json());
// app.use(logger('tiny'));
// app.use(require('./routes.js'));

// app.listen(process.env.PORT || 3000)


router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  fs.readFile(filepath, 'utf8', function(err, xmlStr) {
    if (err) throw (err);
    xml2js.parseString(xmlStr, {}, cb);
  });
}
//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  fs.unlinkSync(filepath);
  fs.writeFile(filepath, xml, cb);
}


router.get('/', function(req, res) {

    res.render('index');
});


router.get('/get/html', function(req, res) {

    res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
    
    var xml = fs.readFileSync('RitasCoffee.xml', 'utf8'); //We are reading in the XML file
    var xsl = fs.readFileSync('RitasCoffee.xsl', 'utf8'); //We are reading in the XSL file
    
    var doc = xmlParse(xml); //Parsing our XML file
    var stylesheet = xmlParse(xsl); //Parsing our XSL file
    
    var result = xsltProcess(doc, stylesheet); //This does our XSL Transformation
    
    xmlFileToJs('RitasCoffee.xml', function(err, result) {
        if (err) throw (err);
        console.log(result);   //or result.toString() 
    });
    
    res.end(result.toString()); //Send the result back to the user, but convert to type string first
});

router.post('/post/json', function (req, res) {

    function appendJSON(obj) {

        console.log(obj)

        xmlFileToJs('RitasCoffee.xml', function (err, result) {
            if (err) throw (err);
            
            result.cafemenu.section[obj.sec_n].entree.push({'item': obj.item, 'price': obj.price});

            console.log(JSON.stringify(result, null, "  "));

            jsToXmlFile('RitasCoffee.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');

});

router.post('/post/delete', function (req, res) {

    function deleteJSON(obj) {

        console.log(obj)

        xmlFileToJs('RitasCoffee.xml', function (err, result) {
            if (err) throw (err);
            
            delete result.cafemenu.section[obj.section].entree[obj.entree];

            console.log(JSON.stringify(result, null, "  "));

            jsToXmlFile('RitasCoffee.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back');

});


server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Server listnening at", addr.address + ":" + addr.port);
});