const express = require("express");
const app = express();
const mongoose = require("mongoose");
//dotenv
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const bodyParser = require("body-parser");

//login libraries
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const initializePassport = require("./passport-config");
//paytm
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { initPayment, responsePayment } = require("./paytm/services/index");
//auth each role
// const { checkAuthenticated, checkNotAuthenticated } = require("./roleAuth");
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

//middlewares
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

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
app.use(cors());
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
app.delete("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
// //redirect-routes
// app.get("/", checkAuthenticated, (req, res) => {
//   const role = req.user.role;
//   res.redirect(`/${role}`);
// });

app.get("/paywithpaytm", (req, res) => {
  initPayment(10).then(
    (success) => {
      console.log(process.env.PAYTM_FINAL_URL);
      res.render("paytm/paytmRedirect", {
        resultData: success,
        paytmFinalUrl: process.env.PAYTM_FINAL_URL,
      });
    },
    (error) => {
      res.send(error);
    }
  );
});

app.post("/paywithpaytmresponse", async (req, res) => {
  if (responsePayment(req.body)) {
    // res.render("response.ejs", {resultData: "true", responseData: success});
    // let data = await fetch("https://api.github.com/users",{method: "GET"});
    // let json = await data.json();
      return res.send("Success");
  }
  res.send("error");
});

// //redirect-routes
// app.get("/", checkAuthenticated, (req, res) => {
//   const role = req.user.role;
//   res.redirect(`/${role}`);
// });




//listening server
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
