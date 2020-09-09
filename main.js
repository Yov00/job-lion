const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const db  = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5200 || 5000;
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');

// Model relationships
const relations = require('./models/ModelRelations');
relations();

// Authentication
const initializePassport = require('./passportConfig');
initializePassport(passport);


// Load env variables
dotenv.config({path:'./config/config.env'});


// Handlebars
app.engine('handlebars',exphbs({defaultLayout:'main',
          runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true,
        }
    }));

app.set('view engine','handlebars');

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// cookie:{maxAge:2250},
// resave:false,
// saveUninitialized:false

// Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized:false
}));
app.use(cors({
    methods:['GET','POST'],
    credentials:true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());





// routes
app.use('/gigs',require('./routes/gigs'));
app.use('/user',require('./routes/users'));


// Test DB
db.authenticate()
    .then(()=>console.log('db connection success!'))
    .catch(err=>console.log(err));

// Routes
app.get('/',(req,res)=>{
    res.render('index',{layout:'landing',user:req.user});
});

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
});


