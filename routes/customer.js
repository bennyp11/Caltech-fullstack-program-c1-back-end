const express = require('express');
const dotenv = require('dotenv').config('../.env');
const mysql = require('mysql2');
const router = express.Router();
const auth = require('../middleware/auth');

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

con.connect(function(err){
    if(err) {console.log(err)}
    else {console.log("CONNECTED")}
});

router.post('/create', async function (req, res, next) {
  try {
    let { company, email } = req.body; 
    const checkEmail = `Select * FROM customers WHERE email = ?`;
    con.query(checkEmail, [email], (err, result, fields) => {
        console.log('result: ', result)
      if(!result.length){
        const sql = `Insert Into customers (company, email) VALUES ( ?, ? )`
        con.query(
          sql, [company, email],
        (err, result, fields) =>{
          if(err){
            console.log('error: ', err)
            res.send({ status: 0, data: err });
          }else{
            console.log('result: ', result)
            res.send({ status: 1, data: result});
          }
        })
      }
    });
  } catch (error) {
    console.log('error: ', error)
    res.send({ status: 0, error: error });
  }
});

router.get('/get', async function (req, res, next){
  try {
    const sql = `Select * from customers`;
    con.query(sql,(err, result, fields)=> {
      if(err){
        console.log('error: ',err)
        res.send({status:0,data:err});
      }else{
        const customersArray = result.map((customer)=> {
          return {
            customerid: customer.customerid,
            company: customer.company,
            email: customer.email
          }
        })
        res.send({status:1,data:customersArray});
      }
    })
  } catch (error) {
    console.log('error: ', error);
    res.send({ status: 0, error: error })
  }
});

router.put('/update', async function (req, res, next){
  try{
  let { customerid, company, email } = req.body;
  customerid = Number(customerid);
  console.log(req.body)
  const checkCustomerId = `Select * FROM customers where customerid = ?`;
  con.query(checkCustomerId, [customerid], (err, result, fields)=> {
    console.log(result)
    if(result.length){
      const sql = `UPDATE customers SET email = ?, company = ? WHERE customerid = ?`;
      con.query(sql, [company, email, customerid], (err, result, fields) => {
        if(err){
          console.log('error: ', err)
          res.send({statu: 0, data: err})
        }else{
          res.send({status: 1, data: result})
        }
      })
    }
  })
} catch (error){
  console.log('error: ', error)
  res.send({ status: 0, error: error });
}
});

module.exports = router;