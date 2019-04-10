var express             = require("express"),
    app                 = express(),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    expressSanitizer    = require("express-sanitizer");
    
mongoose.connect("mongodb://aidan:test123@ds239055.mlab.com:39055/lfcplayersapp");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE CONFIG
var lfcSchema = new mongoose.Schema({
    name: String,
    image: String,
    goals: Number,
    bio: String
});

var Player = mongoose.model("Players", lfcSchema)

//RESTful ROUTES
app.get("/", function(req,res){
    res.redirect("/players");
});

//INDEX ROUTE
app.get("/players", function(req,res){
    Player.find({}, function(err, players){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {players: players});
        }
    });
});

//NEW ROUTE
app.get("/players/new", function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/players", function(req, res){
   //create player
   req.body.player.body = req.sanitize(req.body.player.body);
   Player.create(req.body.player, function(err, newPlayer){
        if(err){
            res.render("new");
        } else {
            //then redirect to index
            res.redirect("/players");
       }
   });

});

//SHOW ROUTE
app.get("/players/:id", function(req,res){
    Player.findById(req.params.id, function(err, foundPlayer) {
        if(err){
            res.redirect("/players");
        } else {
            res.render("show", {player: foundPlayer});
       }
    })
});

//EDIT ROUTE
app.get("/players/:id/edit", function(req, res){
    Player.findById(req.params.id, function(err, foundPlayer){
        if(err){
            res.redirect("/players");
        } else {
            res.render("edit", {player: foundPlayer})
        }
    });
});

//UPDATE ROUTE
app.put("/players/:id", function(req, res){
    req.body.player.bio = req.sanitize(req.body.player.bio);
    Player.findByIdAndUpdate(req.params.id, req.body.player, function(err, updatedPlayer){
        if(err){
            res.redirect("/players");
        } else {
            res.redirect("/players/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/players/:id", function(req, res){
   //destroy player
   Player.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/players");
      } else {
          res.redirect("/players");
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS OPERATIONAL");
})