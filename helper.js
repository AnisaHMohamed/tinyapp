// const urlDatabase = {};
// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "124@g.com",
//     password: "1234"
//   },
//   "user2RandomID": {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
// };

const emailLookup = (emailToCheck,users) =>{
  console.log("users ->",users)
  console.log("emails ->",emailToCheck)
  for (let userId in users) {
    if (users[userId].email === emailToCheck) {

      return userId;
    }
  }

  return false;
};
const paswordLookup = (passwordToCheck,users) =>{
  for (let user in users) {

    if (users[user].password === passwordToCheck) {
      return true;
    }
  }
  return false;
};
const urlsForUser = (id,urlDatabase) =>{
  let urlsForID = {};
   
  for (let randomID in  urlDatabase) {
    console.log("the shortURL in urls",randomID);
    if (urlDatabase[randomID].userID === id) {
      urlsForID[randomID] = urlDatabase[randomID];
    }

  }

  console.log(id,"urls for user function",urlsForID);
  return urlsForID;
};
module.exports = { emailLookup, paswordLookup, urlsForUser};