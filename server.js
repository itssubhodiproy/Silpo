const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//dotenv
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
//login libraries
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const initializePassport = require("./passport-config");
//auth each role
const { checkAuthenticated, checkNotAuthenticated } = require("./roleAuth");
//MongoDB connection
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log(`Database is connected`)
);

//initializing passport
initializePassport(passport);
// it folking matters for uploading files
app.use(bodyParser.urlencoded({ limit: '4mb', extended: false }))
//middlewares
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))

//login middlewares
app.use(flash());
app.use(
  session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));



//set individual routes for individual endpoint
const registerRoute = require("./routes/register");
app.use("/register", registerRoute);

const adminRoute = require("./routes/admin");
app.use("/admin", adminRoute);

const loginRoute = require("./routes/login");
app.use("/login", loginRoute);

const customerRoute = require("./routes/customer");
app.use("/customer", customerRoute);

const driverRoute = require("./routes/driver");
app.use("/driver", driverRoute);

//for logout
const logoutRoute = require("./routes/logout");
app.use("/logout", logoutRoute);
//landing page
app.get("/",checkNotAuthenticated, (req, res) => {
  res.render("landingPage.ejs");
});
//redirect-routes
app.get("/role", checkAuthenticated, (req, res) => {
  const role = req.user.role;
  res.redirect(`/${role}`);
});


//listening server
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
