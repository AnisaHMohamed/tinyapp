const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const {emailLookup, paswordLookup, urlsForUser} = require('./helper');
const PORT = 8080; // default port 8080
let cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  secret: 'Anisa',

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "124@g.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.set("view engine", "ejs");
const urlDatabase = {};

const generateRandomString = (longURL) => {
  
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
//  console.log(req.cookies)
  let individualURLS = urlsForUser(req.session.user_id,urlDatabase);
  console.log(individualURLS);

  let templateVars = { urls: individualURLS, greeting: "A URL Shortnening App by Anisa Mohamed", user: users[req.session.user_id]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {user: users[req.session.user_id]};
 
  if (!users[req.session.user_id]) {
    res.redirect("/login");
    return;
  }

  res.render("urls_new",templateVars);
});

app.get("/urls/:shortURL", (req, res) => {

  console.log(urlDatabase);
  console.log(req.params.shortURL);

  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_id]};

  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL =  urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
app.get("/registration", (req,res)=>{
  let templateVars = {user: users[req.session.user_id]};
  res.render('registration',templateVars);
});


app.get("/login",(req,res)=> {
  let templateVars = {user: users[req.session.user_id]};

  res.render('login', templateVars);
});

app.post("/urls/:shortURL/delete",(req,res) =>{
  console.log("shortURL plus delete",req.params.shortURL,"the user id is below");
  console.log(req.session.user_id);
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});
app.post("/urls", (req, res) => {
  // console.log(req.body);
  let shortURL = generateRandomString(req.body.longURL);
  urlDatabase[shortURL] = {"longURL":req.body.longURL,"userID":req.session.user_id};
  //console.log("/urls --->",urlDatabase)
  
  //console.log(urlDatabase)
  //res.send(randomUrl);
  res.redirect(`/urls/${shortURL}`);      // Respond with 'Ok' (we will replace this)
});
//button for update page
app.post("/urls/:shortURL/update", (req, res) => {
  //let randomUrl = generateRandomString(req.body.longURL);
  urlDatabase[req.params.shortURL] = {'longURL' : req.body.longURL, "userID":req.session.user_id};

  // urlDatabase.forEach(req.params.shortURL[longURL]===randomUrl =>{
    
  // };
  res.redirect('/urls');
});



app.post("/logout",(req,res)=>{
  req.session.user_id = null;
  res.redirect('/urls/new');


});

app.post("/login",(req,res) =>{

  let email = req.body.email;/////check if an email and pasword are correct
  let password = req.body.password;

  //console.log(emailLookup(email))
  //console.log(users[emailLookup(email)].email)
  let userId = emailLookup(email,users);
  if (!userId) {
    console.log("your email doesn't exist");
    res.status(403).send("Invalid Email");
  } else if (userId && (paswordLookup(password,users)) === false) {
    console.log("your email and password don't exist");

    res.status(403).send("Incorrect Password");

  } else if (userId && (paswordLookup(password,users))) {
    req.session.user_id = userId;
    res.redirect('/urls');
  }
});

app.post("/logout",(req,res)=>{
  req.session.user_id = null;
  res.redirect('/urls/new');


});

app.post("/register", (req,res)=>{
  let email = req.body.email;
  const password = bcrypt.hashSync(req.body.password,10);
  console.log(bcrypt.compareSync(req.body.password,  password));
  console.log("My real password ",req.body.password, "is the same as", password);
  let randomId = generateRandomString('id');
  if (email === '' || password === '') {
    res.status(400).send("Enter a valid Email and Password");
    return;
  } else if (emailLookup(email)) {
    res.status(400).send("This email is already registered");
    return;
  }
  
  users[randomId] = {
    id:randomId,
    email: email,
    password:password
  };
  console.log(users);
  req.session.user_id = randomId;
  res.redirect("/urls");
});
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

