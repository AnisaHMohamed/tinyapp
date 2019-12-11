const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
const emailLookup = (emailToCheck) =>{
for (userId in users){
 if( users[userId].email === emailToCheck){

   return userId
 }
}
return false
}
const paswordLookup = (passwordToCheck) =>{
  for (user in users){

   if( users[user].password === passwordToCheck){
     return true
   }
  }
  return false
  }
app.set("view engine", "ejs") 
const urlDatabase = {};
function generateRandomString(longURL) {
  
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
 // console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});




app.get("/urls", (req, res) => {
//  console.log(req.cookies)
  let templateVars = { urls: urlDatabase, greeting: "Hi", user: users[req.cookies.user_id]};
  res.render("urls_index", templateVars);
 });

 app.get("/urls/new", (req, res) => {
   let templateVars ={user: users[req.cookies.user_id]}
  res.render("urls_new",templateVars);
});

 app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies.user_id]};
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
   const longURL =  urlDatabase[req.params.shortURL]
   //console.log(longURL)
  res.redirect(longURL);
});
app.get("/registration", (req,res)=>{
 let templateVars = {user: users[req.cookies.user_id]}
res.render('registration',templateVars)
})


 app.get("/login",(req,res)=> {
  let templateVars = {user: users[req.cookies.user_id]}

    res.render('login', templateVars)
 })




app.post("/urls/:shortURL/delete",(req,res) =>{
  delete urlDatabase[req.params.shortURL];
  //console.log(urlDatabase)
  res.redirect('/urls');

})
app.post("/urls", (req, res) => {
 // console.log(req.body); 
  let randomUrl = generateRandomString(req.body.longURL);
  urlDatabase[randomUrl] = req.body.longURL;
  //console.log(urlDatabase)
  //res.send(randomUrl);   
  res.redirect(`/urls/${randomUrl}`)      // Respond with 'Ok' (we will replace this)
});
//button for update page
app.post("/urls/:shortURL/update", (req, res) => {
   let randomUrl = generateRandomString(req.body.longURL);
  //console.log("----->", req.body)
  urlDatabase[req.params.shortURL] = req.body.longURL ;
  //console.log(urlDatabase)
  // urlDatabase.forEach(req.params.shortURL[longURL]===randomUrl =>{
    
  // };
  res.redirect('/urls');
});



app.post("/logout",(req,res)=>{
  res.clearCookie('user_id',req.body.user_id)
  res.redirect('/urls/new')


})

 app.post("/login",(req,res) =>{

  let email = req.body.email;/////check if an email and pasword are correct
  let password = req.body.password;

  console.log(emailLookup(email))
  //console.log(users[emailLookup(email)].email)
  let userId = emailLookup(email);
  if (!userId){
    console.log("your email doesn't exist")
    res.status(403).send("Invalid Email")
  } else if(userId && (paswordLookup(password)) === false){
    console.log("your email and password don't exist")

    res.status(403).send("Incorrect Password")

  }else if (userId && (paswordLookup(password))){
  res.cookie('user_id',userId)
  res.redirect('/urls')
}
})
 /*If a user with that e-mail cannot be found, return a response with a 403 status code.
 If a user with that e-mail address is located, compare the password given in the form with the existing user's password. If it does not match, return a response with a 403 status code.
 If both checks pass, set the user_id cookie with the matching user's random ID, then redirect to /urls.
*/
app.post("/logout",(req,res)=>{
  res.clearCookie('user_id',req.body.user_id)
  res.redirect('/urls/new')


})

app.post("/register", (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let randomId = generateRandomString('id');
  if (email === '' || password === ''){
    res.status(400).send("Enter a valid Email and Password")
    return
  } else if( emailLookup(email)){
     res.status(400).send("This email is already registered")
   return
  }
  
  users[randomId] = {
    id:randomId,
    email: email,
    password:password
  }
  console.log(users)
  res.cookie("user_id",randomId)
res.redirect("/urls")
})
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

