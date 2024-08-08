const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// connection with database
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", function (req, res) {
  res.send("I am adarsh");
});

// Index Route
app.get("/listings", async function (req, res) {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});
// create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// new route
app.get("/listings/new", function (req, res) {
  res.render("./listings/new.ejs");
});

// show route
app.get("/listings/:id", async function (req, res) {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
});

// update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
});

// app.get("/testListing", async function (req, res) {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By my beach",
//     price: 1200,
//     location: "calangute , Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample saved");
//   res.send("succesful testing");
// });

app.listen(8080, () => {
  console.log("server is listening");
});
