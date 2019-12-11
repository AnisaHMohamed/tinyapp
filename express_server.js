const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.use(cookieParser())

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
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  console.log(req.body); 
  let randomUrl = generateRandomString(req.body.longURL);
  urlDatabase[randomUrl] = req.body.longURL;
  console.log(urlDatabase)
  //res.send(randomUrl);   
  res.redirect(`/urls/${randomUrl}`)      // Respond with 'Ok' (we will replace this)
});


app.get("/urls", (req, res) => {
  console.log(req.cookies)
  let templateVars = { urls: urlDatabase, greeting: "Hi", username: req.cookies["username"]};
  res.render("urls_index", templateVars);
 });

 app.get("/urls/new", (req, res) => {
   let templateVars ={username: req.cookies["username"]}
  res.render("urls_new",templateVars);
});

 app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username:req.cookies["username"]};
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
   const longURL =  urlDatabase[req.params.shortURL]
   console.log(longURL)
  res.redirect(longURL);
});
app.post("/urls/:shortURL/delete",(req,res) =>{
  delete urlDatabase[req.params.shortURL];
  console.log(urlDatabase)
  res.redirect('/urls');

})
//button for update page
app.post("/urls/:shortURL/update", (req, res) => {
   let randomUrl = generateRandomString(req.body.longURL);
  console.log("----->", req.body)
  urlDatabase[req.params.shortURL] = req.body.longURL ;
  //console.log(urlDatabase)
  // urlDatabase.forEach(req.params.shortURL[longURL]===randomUrl =>{
    
  // };
  res.redirect('/urls');
});

app.post("/login",(req,res) =>{

  let username = req.body.username;

  res.cookie('username',req.body.username)

res.redirect('/urls')
})
app.post("/logout",(req,res)=>{
  res.clearCookie('username',req.body.username)
  res.redirect('/urls/new')


})
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });