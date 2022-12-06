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
    else {console.log("MEETING ROUTE CONNECTED")}
});

router.post('/create', async function (req, res, next) {
  try {
    let { status, date, time, email, description } = req.body; 
        const sql = `Insert Into meetings (status, meetingdate, meetingtime, customeremail, meetingdescription) VALUES ( ?, ?, ?, ?, ? )`
        con.query(
          sql, [status,date,time,email,description],
        (err, result, fields) =>{
          if(err){
            console.log('error: ', err)
            res.send({ status: 0, data: err });
          }else{
            console.log('result: ', result)
            res.send({ status: 1, data: result});
          }
        })
  } catch (error) {
    console.log('error: ', error)
    res.send({ status: 0, error: error });
  }
});

router.get('/get', async function (req, res, next){
  try {
    const sql = `Select * from meetings`;
    con.query(sql,(err, result, fields)=> {
      if(err){
        console.log('error: ',err)
        res.send({status:0,data:err});
      }else{
        const meetingsArray = result.map((meeting)=> {
          return {
            meetingid: meeting.meetingid,
            status: meeting.status,
            date: meeting.meetingdate,
            time: meeting.meetingtime,
            email: meeting.customeremail,
            description: meeting.meetingdescription
          }
        })
        res.send({status:1,data:meetingsArray});
      }
    })
  } catch (error) {
    console.log('error: ', error);
    res.send({ status: 0, error: error })
  }
});

router.put('/update', async function (req, res, next){
  try{
  let { status, meetingid, date, time, email, description } = req.body;
  meetingid = Number(meetingid);
  console.log(req.body)
  const checkMeetingId = `Select * FROM meetings where meetingid = ?`;
  con.query(checkMeetingId, [meetingid], (err, result, fields)=> {
    console.log(result)
    if(result.length){
      const sql = `UPDATE meetings SET status = ?, meetingdate = ?, meetingtime = ?, customeremail = ?, meetingdescription = ? WHERE meetingid = ?`;
      con.query(sql, [status, date, time, email, description, meetingid], (err, result, fields) => {
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