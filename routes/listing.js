const express=require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError= require("../utils/ExpressErrors.js");//2 folder above



 //validate schema
 const validateListing=(req,res,next)=>{
     let {error}= listingSchema.validate({
         listing:req.body.listing || req.body
     });
     if(error){
         throw new ExpressError(400, error);
     }else{
         next();
     }
 };


//index route

router.get("/", wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");

});

//show route
router.get("/:id", wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested  for does not exist");
        res.redirect("/listings");
        return;
    }
    res.render("listings/show.ejs",{listing});

}));

//create route
router.post("/", validateListing,wrapAsync(async(req,res, next)=>{
 // let{title,description,image,price,country,location}=req,body;
   //let listing=req.body.listing;

   const newListing=new Listing(req.body.listing);


   await newListing.save();
   req.flash("success","new listing created!");
   res.redirect("/listings");   
  

}));

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
     let{id}=req.params;
    const listing=await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing you requested  for does not exist");
        res.redirect("/listings");
        return;
    }
    res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id",wrapAsync(async(req,res)=>{
 let{id}=req.params;

await Listing.findByIdAndUpdate(id,{...req.body.listing});
req.flash("success","listing updated");
res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
 let{id}=req.params;
 let deletedListing=await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 req.flash("success","listing deleted");
 res.redirect("/listings");
}));

module.exports=router;