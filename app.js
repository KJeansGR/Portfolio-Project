//import express module // this is why you add "type: module"
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

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
    res.render('contactform');
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

//admin route
app.get('/admin', async(req, res)=>{

    try {
        const [users] = await pool.query('SELECT * FROM contacts ORDER BY timestamp DESC'); 
        res.render('admin', { users });        
    }
    catch (err) {
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
