const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const jwt = require("jsonwebtoken");
const secretKey = "MySecretAuthenticationKey";

// Authentication

app.post("/login", function (req, res) {
  const user = new User(req.body);
  const accessToken = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, function (err, user) {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// API 1 for Users

// Schema

const userSchema = new mongoose.Schema({
  name: String,
  points: {
    type: Number,
    default: 0,
  },
  githubLink: String,
});

// Collection
const User = new mongoose.model("User", userSchema);

// Create User
app.post("/user", authenticateToken, function (req, res) {
  const user = new User(req.body);

  user
    .save()
    .then(function () {
      res.status(201).send(user);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
});

// Read All Users
app.get("/user", authenticateToken, function (req, res) {
  User.find({})
    .then(function (users) {
      res.status(200).send(users);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// Read Single User
app.get("/user/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }
  User.findById(req.params.id)
    .then(function (result) {
      if (!result) {
        res.status(404).send("User not found.");
      } else {
        res.status(200).send(result);
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// Update User
app.put("/user/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }
  User.updateOne({ _id: req.params.id }, req.body, { new: true })
    .then(function (user) {
      if (!user) {
        res.status(404).send("User not found.");
      } else {
        res.status(200).send(user);
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

//Delete User
app.delete("/user/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }
  User.findByIdAndDelete(req.params.id)
    .then(function (user) {
      if (!user) {
        res.status(404).send("User not found.");
      } else {
        res.status(200).send("User deleted.");
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

//Endpoint for liking other's posts
app.post("/like/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }
  User.findById(req.params.id)
    .then(function (user) {
      if (!user) {
        res.status(404).send("User not found.");
      } else {
        user.points += 1;
        user.save();
        res.status(200).send(user);
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

//Retrieving users in ascending order of points
app.get("/ranks", authenticateToken, function (req, res) {
  User.find({})
    .sort("points")
    .then(function (users) {
      res.status(200).send(users);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// API 2 for Jobs

// Schema

const jobSchema = new mongoose.Schema({
  date: Date,
  link: String,
  title: String,
  usersApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Job = new mongoose.model("Job", jobSchema);

// Create Job
app.post("/job", authenticateToken, function (req, res) {
  const job = new Job(req.body);

  job
    .save()
    .then(function () {
      res.status(201).send(job);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
});

// Read All Jobs
app.get("/job", authenticateToken, function (req, res) {
  Job.find({})
    .then(function (job) {
      res.status(200).send(job);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// Single Read
app.get("/job/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid job ID");
  }
  Job.findById(req.params.id)
    .then(function (result) {
      if (!result) {
        res.status(404).send("Job not found.");
      } else {
        res.status(200).send(result);
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// Update
app.put("/job/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid job ID");
  }
  Job.updateOne({ _id: req.params.id }, req.body, { new: true })
    .then(function (job) {
      if (!job) {
        res.status(404).send("Job not found.");
      } else {
        res.status(200).send(job);
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

//Delete
app.delete("/job/:id", authenticateToken, function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid job ID");
  }
  Job.findByIdAndDelete(req.params.id)
    .then(function (job) {
      if (!job) {
        res.status(404).send("Job not found.");
      } else {
        res.status(200).send("Job deleted.");
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

// Apply for job
app.post("/job/apply/:userID/:jobID", authenticateToken, function (req, res) {
  // Validating IDs
  if (!mongoose.isValidObjectId(req.params.jobID)) {
    return res.status(400).send("Invalid job ID");
  }
  if (!mongoose.isValidObjectId(req.params.userID)) {
    return res.status(400).send("Invalid user ID");
  }

  //Checking if job exists
  Job.findById(req.params.jobID)
    .then(function (job) {
      if (!job) {
        return res.status(404).send("Job not found.");
      }

      //Checking if user exists
      User.findById(req.params.userID).then(function (user) {
        if (!user) {
          return res.status(404).send("User not found.");
        }
        job.usersApplied = job.usersApplied || [];
        // Checking if user already exists in the list
        if (job.usersApplied.includes(user._id)) {
          return res.status(400).send("User already applied for this job");
        }

        // Add user to the list of users who applied for the job
        job.usersApplied.push(user._id);
        job
          .save()
          .then(function () {
            res.status(200).send(job);
          })
          .catch(function (err) {
            res.status(500).send(err);
          });
      });
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

app.listen(8000, function () {
  console.log("Server started at http://localhost:8000/\n");
});
