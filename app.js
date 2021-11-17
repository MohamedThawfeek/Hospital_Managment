const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passport_local_mongoose = require("passport-local-mongoose");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/assets", express.static("assets"));
app.use("/script", express.static("script"));

app.use(
  session({
    secret: "123!@#",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose.connect(process.env.DB_URL);

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const customerSchema = {
  userId: String,
  name: String,
  mobileNo: Number,
  address: String,
  disease: String,
  doctor: String,
};

userSchema.plugin(passport_local_mongoose);

const User = new mongoose.model("Administrator-User", userSchema);

const Customer = mongoose.model("Patient_info", customerSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});

app.get("/patient_info", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("search", {
      url: "search",
      option: "Search",
      buttonName: "Search",
    });
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/appoinment", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("appoinment");
  } else {
    res.redirect("/");
  }
});

app.get("/update", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("search", {
      url: "update",
      option: "Update",
      buttonName: "Update",
    });
  }
});

app.get("/delete", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("search", {
      url: "delete",
      option: "Delete",
      buttonName: "Delete",
    });
  }
});

app.post("/", (req, res) => {
  // User.register(
  //   {
  //     username: req.body.username,
  //   },
  //   req.body.password
  // ).then(() => {
  //   passport
  //     .authenticate("local")(req, res, () => {
  //       res.redirect("/admin");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("loacal")(req, res, () => {
        res.redirect("/admin");
      });
    }
  });
});

app.post("/admin", (req, res) => {
  const customer = new Customer(req.body);

  customer.save().then(() => {
    res.render("success", {
      subtitle: "Success",
      subject: "added",
    });
  });
});

app.post("/search", (req, res) => {
  Customer.findOne({ userId: req.body.userId }).then((userdata) => {
    if (userdata) {
      res.render("searchResult", {
        userId: userdata.userId,
        name: userdata.name,
        address: userdata.address,
        mobileNo: userdata.mobileNo,
        disease: userdata.disease,
        doctor: userdata.doctor,
      });
    } else {
      res.render("searchFailure", {
        url: "patient_info",
      });
    }
  });
});

app.post("/delete", (req, res) => {
  Customer.findOneAndDelete({ userId: req.body.userId }).then(() => {
    res.render("success", {
      subtitle: "Delete",
      subject: "deleted",
    });
  });
});

app.post("/update", (req, res) => {
  Customer.findOne({ userId: req.body.userId }).then((userdata) => {
    if (userdata) {
      res.render("updatePage", {
        userId: userdata.userId,
        name: userdata.name,
        address: userdata.address,
        mobileNo: userdata.mobileNo,
        disease: userdata.disease,
        doctor: userdata.doctor,
      });
    } else {
      res.render("searchFailure", {
        url: "update",
      });
    }
  });
});

app.post("/updateResult", (req, res) => {
  Customer.findOneAndUpdate({ userId: req.body.userId }, req.body).then(() => {
    res.render("success", {
      subtitle: "Update",
      subject: "updated",
    });
  });
});

app.listen(PORT, () => {
  console.log("Server is Up and Running");
});
