import express from 'express';

const app = express();

const PORT = 3000;

//MiddleWare that allows express 
//to read form data and store it in req.body
app.use(express.urlencoded({extended: true}))

app.use(express.static('public'));

//makes ejs usable
app.set('view engine', 'ejs');


const users = []; // an array of user objects
let pendingUserInfo = {}; //temp holder for user info before complet confirmation

app.get('/', (req,res) => {
    pendingUserInfo={};// clear pending Users info
    res.render('home');
});

app.post('/confirm', (req,res) =>{
    pendingUserInfo = {
        fname:       ["First Name", req.body['f-name']],
        lname:       ["Last Name", req.body['l-name']],
        job:         ["Job", req.body['job']],
        company:     ["Company", req.body['company']],
        linkedin:    ["LinkedIn", req.body['linkedin']],
        email:       ["Email", req.body['email']],
        metSelect:   ["How we met", req.body['met-select']],
        otherMet:    ["How we met other specified", req.body['other-met']],
        mailList:    ["Add to mailing list", req.body['mail-list']? "yes":"no"],
        format:      ["Mailing format", req.body['format']],
        message:     ["Message", req.body['message']]
    };
    res.render('confirmation', {pendingUserInfo})
})

app.get('/thankyou', (req,res) => {
    users.push(pendingUserInfo);// push the confirmed pending user to "Actual Users array"
    pendingUserInfo = {}; // clear pending Users info
    res.render('thankyou');
});

//admin route
app.get('/admin', (req, res)=>{

    res.send(users); // displays the json of orders array

})

app.listen(PORT, () =>{
console.log(`Server Running at
    http://localhost:${PORT}`)
});

