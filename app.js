//import express module // this is why you add "type: module"
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import { validateForm } from './validation.js';

//load environment variables
dotenv.config();
const app = express();
const PORT = 3000;

//MiddleWare that allows express to read form data and store it in req.body
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
//makes ejs usable
app.set('view engine', 'ejs');

//create a pool of database connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user:  process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    port:  process.env.DB_PORT

}).promise();

app.get('/', (req,res) => {
        res.render('home');
});


let users = {};                                                         // an array of user objects
let pendingUserInfo = {};                                               //temp holder for user info before complet confirmation

app.get('/contact', (req,res) => {
    pendingUserInfo={};                                                 // clear pending Users info when routing to this route
    res.render('contactform', {errors: []});                            // here i pass an empty errors array so that the page will load this prevents having to have an if check in the ejs page, <% if(typeof errors != 'undefined') {%>
});

app.get('/portfolio', (req, res)=>{
    res.render('portfolio');
});

app.post('/confirm', (req,res) =>{

    const met = req.body['met-select'] +" "+ req.body['other-met'];     //this joins the "how we met" options into one output for the database in case someone choose both options

    pendingUserInfo = {
        fname:       ["First Name", req.body['f-name']],
        lname:       ["Last Name", req.body['l-name']],
        job:         ["Job", req.body['job']],
        company:     ["Company", req.body['company']],
        linkedin:    ["LinkedIn", req.body['linkedin']],
        email:       ["Email", req.body['email']],
        metSelect:   ["How we met", met],
        //otherMet:    ["How we met other specified", req.body['other-met']],
        mailList:    ["Add to mailing list", req.body['mail-list']? "yes":""],
        format:      ["Mailing format", req.body['format'] || ''],
        message:     ["Message", req.body['message']]
        //timeStamp:   ["Time Stamp", new Date().toLocaleString()]
    };

    
    const valid = validateForm(pendingUserInfo);
    if(!valid.isValid){
        console.log(pendingUserInfo.metSelect[1]);
        res.render('contactform', {errors: valid.errors});
        return;
    }


    res.render('confirmation', {pendingUserInfo})
})

app.get('/thankyou', async(req,res) => {
    try {

    let idx = Object.keys(users).length + 1;            // this sets  "User #" "key" incrementally, initially did this for debug-test page for pretty print. might be overkill now.
    users[`User ${idx}`] = pendingUserInfo;             // add pending user to "Actual Users" as an object entry keyed with "User #" and value of pendingUserInfo. again, maybe overkill with the objects

    const sql = 'INSERT INTO contacts (firstName, lastName, job, company, linkedin,email, met, mailingList, mailingFormat, message)VALUES(?,?,?,?,?,?,?,?,?,?)';
    
    const vals = Object.values(pendingUserInfo);        //turn user array into an array of its values which itself is an array of arrays [string, value]
    // console.log("VALS HERE: ");console.log( vals);

    let vs = [];                                        //turn vals array into an array of only the values to store in the sql server
    vals.forEach(([k,v] )=>{
        vs.push(v)
    });
    //console.log("Vs HERE: ");console.log( vs);

    const result = await pool.execute(sql, vs);
    pendingUserInfo = {};                                // clear pending Users info
    res.render('thankyou');
    }catch{
        console.error('Error saving order:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
});

//admin route for initial page load. i found out a get route is still required otherwise 
//the page wont initally load, if all i have is a post route
app.get('/admin', async (req, res) => {

    let isValidLogin = false; 
    
    //this SQL query might not be necessary anymore since the route only ever displays login ejs
    //so this SQL table info never actually is visable from this route.
    const [users] = await pool.query( 'SELECT * FROM contacts ORDER BY timestamp DESC' );

    res.render('admin', { users, isValidLogin });
});

//admin route for login, if login credentials are correct, this passes a true boolean to 
//the ejs page which will "toggle" admin tables on instead of login screen
app.post('/admin', async(req, res)=>{
    
    //these logs are valuable to verify credentials are correctly input
    console.log("req: " + req.body);
    console.log("env username:", process.env.Username);
    console.log("env password:", process.env.Password);

    //turn the request item into an object
    let r = {un: req.body.un, pw: req.body.pw};

    let isValidLogin = false; 

    //if credentials match then toggle bool correct to to be passes in as a child to the ejs page
    if(r.un == process.env.Username && r.pw == process.env.Password ){
        isValidLogin = true;
    }

    try {
        const [users] = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC'); 
        res.render('admin', { users, isValidLogin });        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

app.listen(PORT, () =>{
console.log(`Server Running at
    http://localhost:${PORT}`)
});


//db-test route
// app.get('/db-test', async(req,res) =>{
//     try{
//       const data = await pool.query('SELECT * FROM contacts');
//         res.send(data[0]);      
//     }catch(err){
//         console.log('error in db-test');
//     }
// });
