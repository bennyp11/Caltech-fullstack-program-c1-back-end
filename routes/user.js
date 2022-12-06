const express = require('express');
const dotenv = require('dotenv').config('../.env');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

con.connect(function(err){
    if(err) {console.log(err)}
    else {console.log("USER ROUTE CONNECTED")}
});

/* GET users listing. */
router.post('/register', async function (req, res, next) {
  try {
    let { firstname, lastname, email, password } = req.body; 
   
    const hashed_password = md5(password.toString())

    const checkEmail = `Select * FROM users WHERE email = ?`;
    con.query(checkEmail, [email], (err, result, fields) => {
      if(!result.length){
        const sql = `Insert Into users (firstname, lastname, email, password) VALUES ( ?, ?, ?, ? )`
        con.query(
          sql, [firstname, lastname, email, hashed_password],
        (err, result, fields) =>{
          if(err){
            res.send({ status: 0, data: err });
          }else{
            let token = jwt.sign({ data: result }, 'secret')
            res.send({ status: 1, data: result, token : token });
          }
         
        })
      }
    });

    

   
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let { email, password } = req.body; 
   
    const hashed_password = md5(password.toString())
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`
    con.query(
      sql, [email, hashed_password],
    function(err, result, fields){
      if(err){
        res.send({ status: 0, data: err });
      }else{
        let token = jwt.sign({ data: result }, 'secret')
        res.send({ status: 1, data: result, token: token });
      }
     
    })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});



module.exports = router;