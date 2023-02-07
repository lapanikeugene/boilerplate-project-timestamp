// index.js
// where your node app starts
require('dotenv').config({path:"./.env"});
// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

//not valid date; 
function checkNotDate(req,res,next){
  // console.log("check if date is valid")
  const dateString = req.params['date'];
  const date = new Date(dateString);
  console.log(date,isNaN(date.getTime()));
  if(isNaN(date.getTime())){
    // console.log("invalid date");
   return res.json({error:"Invalid Date"})
  }
  // console.log("==========2===========")
  next();
}

function checkUnix(req,res,next){
  if(!isNaN(Number(req.params['date'])))
  {
    // console.log('utc string',req.params['date'])
    const date = new Date(Number(req.params['date']));
  
    // console.log({unix:req.params['date'],utc:date.toUTCString()});
    // console.log("==========================");
  return res.send({unix: Number(req.params['date']),utc:date.toUTCString()});
  }

  next();
}


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/",(req,res)=>{

 
    console.log("empty time1");
    const date = new Date();
    res.send({utc:date.toUTCString(),unix:date.getTime()})
})

app.get("/api/:date",checkUnix,checkNotDate,(req,res)=>{
  const dateString = req.params['date'];
  console.log(dateString);
 

  if(dateString===""){
    const date = new Date()
    return res.json({unix:date.getTime(), utc:`${date.toUTCString()}`});
  }

  const unixDate = new Date(dateString).getTime();
  const utcDate =  new Date(dateString).toUTCString();
  // console.log(date);
  const json = {unix:unixDate,utc:utcDate};
  // console.log(json);
  return res.json(json);
 

})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
