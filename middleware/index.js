var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};



middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               req.flash("error", "CAMPGROUND NOT FOUND");
                res.redirect("back");
           } else {
                // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if(!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
 
               if(foundCampground.author.id.equals(req.user._id)){
                next();
               } else {
                   req.flash("error", "you don't have permission to do that");
                 res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "YOU DON'T HAVE PERMISSION TO DO THAT!!!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
                res.redirect("back");
           } else {
                // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if(!foundComment){
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
 
               if(foundComment.author.id.equals(req.user._id)){
                next();
               } else {
                   req.flash("error", "you do not have permission to do that!!");
                 res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "you need to be logged in to do that!!");
        console.log("you need to be logged in to do that!!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "YOU NEED TO BE LOGGED IN FIRST TO DO THAT!!!");
    res.redirect("/login");
}

module.exports = middlewareObj;