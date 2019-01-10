var express = require("express");
var path = require("path");
var http = require("http");

var app = express();

app.set("views", path.resolve(__dirname, "views"));

app.get("/", function(req, res){
    res.render(index.html);
});

http.createServer(app).listen(3000, function(){
    console.log("Server is running on port 3000");
});

