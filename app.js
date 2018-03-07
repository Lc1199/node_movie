var express = require('express')
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var logger = require('morgan')
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/nodejs'

mongoose.connect(dbUrl)

app.set('views' , './app/views/pages')
app.set('view engine' , 'jade')
app.use(bodyParser.urlencoded())
app.use(serveStatic('public'))
app.use(require('connect-multiparty')())
app.use(session({
	secret:'nodejs',
	store: new MongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

if('development' === app.get('env')){
	app.set('showStackError' , true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug' , true)
}

require('./config/routes')(app)

app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port ' + port)
