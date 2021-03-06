var express = require("express");
var router  = express.Router({mergeParams: true}); 
//then replace all `app` with `router`
//mergeParams: true used to merge params from campground & comments together
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//Comments.new
router.get("/new", isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground}); //name of the template - new.ejs
        }
    });
});


//Comments.create
router.post("/", isLoggedIn, function(req, res){
   //lookup campground by id
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else {    //create new comment
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //connect new comment to campground
                campground.comments.push(comment);
                campground.save();
                //redirect to campground's SHOW page
                res.redirect("/campgrounds/" + campground._id);
            }
         });
      }
   });
});

//MIDDLEWARE
//added this function after seeing error flag at lines 9 and 20
//error was 'isLoggedIn is not defined'
//see index.js for explanation of this function
function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next(); 
    } 
    res.redirect('/login');
}

module.exports = router;