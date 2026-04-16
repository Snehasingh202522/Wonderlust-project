const express=require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressErrors.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");





//const MONGO_URL="mongodb://127.0.0.1:27017/Wonderlust"
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,//one week miliseconds
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};


app.get("/", (req,res)=>{
    res.send(" Hi, i m root");
});


app.use(session(sessionOptions));
app.use(flash());


//middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
   // console.log(res.locals.success);
    next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);






/*app.get("/testListing",async(req,res)=>{
   let sampleListing=new Listing({
    title:"My new villa",
    description:"By the beach",
    price:1200,
    location:"calangute,Goa",
    country:"India",
   });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
 }); */

 app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
 });

 app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
   res.status(statusCode).render("error.ejs",{message});
   // res.status(statusCode).send(message);
 });



app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});