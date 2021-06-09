//Flash data
const flash = require("connect-flash");

// Configure MySQL connection here
const Mysql = require('mysql');
var connection = Mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "user_dashboard",
    "port": 3306
});

module.exports = {
    db_connect: connection,
    set_config: (app, express, session) => {
        //URL encoded parser
        app.use(express.urlencoded({ extended: true }));
        //Static Directory
        app.use(express.static(__dirname + "/assets"));
        //Views Directory
        app.set("views", __dirname + "/views");
        //View Enginer
        app.set("view engine", "ejs");
        //Session
        app.use(session({
            secret: 'express_mvc',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60000 }
        }));
        //Set Session data ad Flash
        //Adding flash messages
        app.use(flash());
        app.use(function(req, res, next) {
            res.locals.user = req.session.loggedin;
            res.locals.success_messages = req.flash('success_messages');
            res.locals.error_messages = req.flash('error_messages');
            next();
        });
    }
};