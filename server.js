let express = require("express"),
 app        = express(),
 bodyParser = require("body-parser"),
 mongoose   = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({
  extended: false
}));
app.set("view engine", "ejs");

// schema setup
let diskparkSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Diskpark = mongoose.model("Diskpark", diskparkSchema);

// Diskpark.create(
//   {
//     name: "Circle C Ranch",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvfrcX26C32NBg1MLYA7751pgnIThivKfSauaMyqJFZjBhIC69HA",
//     description: "This is a huge Park 18 holes"
//   },
//   function(err, diskpark){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("newly created park");
//       console.log(diskpark);
//     }
//   }
// )


app.get("/", function(req, res){
  res.render("landing");
});

// Index - shows all diskparks
app.get("/diskparks", function(req, res){
   // res.render("diskparks", {diskparks: diskparks});
   Diskpark.find({}, function(err, allDiskparks){
     if(err){
       console.log(err);
     } else {
       res.render("index", {diskparks:allDiskparks})
     }
   })
});
// Create - add new diskparks to DB
app.post("/diskparks", function(req, res){
  // get data from and add to diskParks array
  let name  = req.body.name;
  let image = req.body.image;
  let desc  = req.body.description;
  let newDiskpark = {name: name, image: image, description: desc}

  //create a new diskpark save to db
  Diskpark.create(newDiskpark, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      res.redirect("/diskparks");
    }
  });
});
//NEW - show form to create new campground
app.get("/diskparks/new", function(req, res){
   res.render("new");
});

// SHOW - shows more info about one campground
app.get("/diskparks/:id", function(req, res){
    //find the campground with provided ID
    Diskpark.findById(req.params.id, function(err, foundDiskpark){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {diskpark: foundDiskpark});
        }
    });
})

app.listen(3000, function(){
  console.log("disk server is started");
});
