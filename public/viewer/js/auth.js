//B"H


async function continueIfLoggedIn() {
    var loggedIn = await checkIfLoggedin();
    console.log(loggedIn, "testing")
    var usr;
    if(!loggedIn.user || !loggedIn.user.auth.currentUser) {
      console.log("sing in google")
      usr = await signInGoogle();
      console.log("Checking",usr)
      console.log(usr)
      if(!usr || !usr.auth.currentUser) {
        return await continueIfLoggedIn();
      }
    }
    
  
    return true;
  }

  export {
    continueIfLoggedIn
  }