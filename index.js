const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require('child_process');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var reviewText, resultText = null, exp;

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
    res.render("result", { result: resultText,exp:exp })
});
app.get("/error", function (req, res) {
    res.render("error")
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});