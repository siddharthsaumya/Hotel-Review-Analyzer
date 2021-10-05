const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require('child_process');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var reviewText, resultText = null, exp,emotion;
const url = 'mongodb://127.0.0.1:27017';
    var db;
    var review;
    var revArrAll,revArrP,revArrN;



app.get("/", function (req, res) {
    res.render("home");
});

app.post("/", function (req, res) {
    reviewText = req.body.reviewText;
    const childPython = spawn('python', ['sa.py', reviewText]);
    childPython.stdout.on('data', (data) => {
    resultText = "" + data;
    if(resultText != null){
        exp = resultText;
        res.redirect("/result");
    }
    });

    childPython.stderr.on('data', (data) => {
            res.redirect("/error");
    });
});

app.get("/result", function (req, res) {
    resultText = resultText.toUpperCase();
    resultText = resultText.trim();
    if(resultText === "HAPPY"){
        resultText = "We had a great time serving you. We would love to greet you again 🙏.";
        emotion = true;
    }else if(resultText === "NOT HAPPY"){
        resultText = "Sorry for inconvenience. We'll try our best to make your next stay awesome 🙏";
        emotion = false;
    }
    res.render("result", { result: resultText,exp:exp })

    MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        return console.log(err);
    }
     db = client.db('nlpsa');

    review = db.collection('review');
    review.insertOne({ statement:reviewText , isHappy:emotion }, (err, result) => { 
        if (err) {
        return console.log(err);
    }
     console.log(`\nData inserted !!\n`);
     
     //client.close();
    });

         review.find().toArray((err, results) => {
    revArrAll = results;
});

         review.find({isHappy:true}).toArray((err, results) => {
    revArrP = results;
});

         review.find({isHappy:false}).toArray((err, results) => {
    revArrN = results;
});
   
});

});

app.get("/error", function (req, res) {
    res.render("error")
});

app.get("/dashboard", function (req, res) {
    
res.render("dash",{Al:revArrAll.length,Pl:revArrP.length,Nl:revArrN.length,emotions:revArrAll});
   
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});