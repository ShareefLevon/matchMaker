/*
app.js
Match Maker App
A questionaire that compares your results with other peoples results
@author Shareef Levon

@Version 11/27/2018

2018 all rights reserved. 
*/

var express = require('express');
var bodyParser=require('body-parser');
var path= require('path');
var fs= require('fs');
var historyStack= [];
var name;  // name of user
var userResp=[]; // keeps track of user reponses 
var num=0; 
var surveyCount=0; //number of people that took survey
var matchString=""; //final string that displays matches
var quest=fs.readFileSync('surveyQuestions.json','utf-8');
var results=fs.readFileSync('results.json','utf-8');
var app= express();

var resultObj=JSON.parse(results); // json object from the results.json file
var qs = JSON.parse(quest); //Question object from surveyQuestions.json

//engine 

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

// middlware bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//set static path
app.use(express.static(path.join(__dirname,'/views/')));

//GETS INFO FROM MAIN PAGE AND DIRECTS
app.post('/',function(req,res){
    surveyCount++;

   num=0;
    name=req.body.input;
    
    
    if (req.body.operation=='survey'){
        res.redirect('/survey1');
    }
    if (req.body.operation=='match'){
        res.redirect('/match');
    }
    
});
//Home screen
app.get('/',function(req,res){
    num=0;
    userResp=[];
    name="";
    res.render('index',{
        
        his: historyStack
        
    });
    
});
//View controller of what view to render
app.post('/render',function(req,res){
    if(req.body.answer=='vertical'){
         res.render('survey1',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
    }
    if(req.body.answer=='horizontal'){
       res.render('survey2',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
    }
    
    
});
////View controller of what view to render
app.get('/render',function(req,res){
        userResp.pop;
        res.render('render',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
    
  
    
});
//Vertical View Survey Layout
app.get('/survey1',function(req,res){
    if (num==qs.questions.length){
       // res.render('final.ejs');
       res.redirect("/match");
    num++;
    }
   console.log("in survey1");
    res.render('survey1',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
   // res.render('survey1.ejs');
    num++;
});

//Vertical View Survey Layout for post
app.post('/survey1',function(req,res){
    userResp.push(req.body.answer);
   
     if (num==qs.questions.length){
          console.log(userResp);
    //    res.render('final.ejs');
      res.redirect("/match");
    num++;
    }
    res.render('survey1',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
    num++;
    //res.render('survey1.ejs');
    
});
//Horizontal View Survey Layout for get
app.get('/survey2',function(req,res){
    if (num==qs.questions.length){
      //  res.render('final.ejs');
      res.redirect("/match");
    num++;
    }
   console.log("in survey1");
    res.render('survey2',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
   // res.render('survey1.ejs');
    num++;
});
//Horizontal View Survey Layout for post
app.post('/survey2',function(req,res){
    userResp.push(req.body.answer);
   
     if (num==qs.questions.length){
          
          console.log(userResp);
    //    res.render('final.ejs');
      res.redirect("/match");
    num++;
    }
    res.render('survey2',{
        
        question: qs.questions[num],
        qnum: num+1
        
    });
    num++;
    //res.render('survey1.ejs');
    
});
//Final survey page
app.post('/final',function(req,res){
     resultObj[name]=userResp;
    console.log(resultObj[name]);
    
});
//Final survey page
app.get('/final',function(req,res){
    //take in results and add to result obj
   resultObj[name]=userResp;
});
//Match page that shows who user matches with
app.get('/match',function(req,res){
   // compares user responses to response arrays in result.json
 var result = "";
    matchString="";
    
  for (var p in resultObj) {
    if( resultObj.hasOwnProperty(p) ) {
         console.log(result);
        var matchnum=0;
        for(var i=0;i<resultObj[p].length;i++){
            if (userResp[i]==resultObj[p][i]){
                matchnum++;
            }
            //matchString=matchString+"\n "+p+" has "+matchnum+" matches with you\n";
        }
        matchString=matchString+"\n "+p+" has "+matchnum+" matches with you!-- \n";
        console.log(resultObj[p]);
      result += p + " , " + resultObj[p] + "\n";
    } 
  } 
    //add user responses to array of answers
     resultObj[name]=userResp;
    res.render('match',{
        
        matches: matchString
        
    });
    num++;
});
// Port listener
app.listen(8088,function(){
    console.log("The server started! ");
    
    
})
