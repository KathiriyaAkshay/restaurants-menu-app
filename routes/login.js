var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var schemas = require('../models/schemas');
/* GET users listing. */
router.get('/', (req, res) => {
  res.render('login',{title:'Login',loggedIn:false, error:null});
});

router.get('/new-acct', (req, res)=>{
  res.render('new-acct', {title:'New Account', loggedIn:false, error:null })
})

router.post('/', async(req, res)=>{
  let email = req.body.emailInput;
  let pass = req.body.pwdInput;
  let loginSuccess = false;
  let sess = req.session;
  sess.loggedIn = false;
  console.log(email);
  let users = schemas.users;
  let qry = {email:email};

  if( email!='' && pass!=''){
    let userResult = await users.findOne(qry).then(async (data)=>{
      console.log(data);
      if(data){
        let passResult = await bcrypt.compare(pass, data.pwd).then((isMatch)=>{
          
          if(isMatch){
            sess.loggedIn = true;
            loginSuccess = true;
          }
        });
      }
    });
  }

  if(loginSuccess === true){
    res.redirect('/');
  }else{
    res.render('login',{title:'Login', loggedIn: false, error:'Invalid Login!'});
  }
});

router.post('/new', async(req, res)=>{
    let email = req.body.emailInput;
    let pass = req.body.pwdInput;

    if(email != '' && pass!=''){
      let users = schemas.users;
      let qry = {email:email};

      let userSearch = await users.findOne(qry).then(async (data)=>{
        if(!data){
          let saltRounds = 10;
          let passSalt = await  bcrypt.genSalt(saltRounds, async(err, salt)=>{
            let passHash = await bcrypt.hash(pass, salt, async(err, hash)=>{
              let acct = {email:email, pwd:hash, level:'admin'};
              let newUser = new schemas.users(acct);
              let saveUser = await newUser.save();
            });
          });
        }
      });
      res.render('login', {title:'Login', loggedIn:false, error:'Please login with your new account.'});
    }else{
      res.render('new-acct', {title:'New Account', loggedIn:false, error: 'All fields are required. Please check and login again.'})
    }
})

module.exports = router;
