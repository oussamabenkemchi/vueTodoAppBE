const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect("mongodb link");
const taskSchema = new mongoose.Schema({
  item: String,
  status: Boolean,
  deadline: String,
  description: String,
});

const Task = new mongoose.model("task", taskSchema);
app.route("/").get((req, res) => {
  Task.find((err, foundTasks) => {
    if (err) {
      res.send(err);
    }
    res.send(foundTasks);
  });
});
app
  .route("/tasks")
  .get((req, res) => {
    Task.find((err, foundTasks) => {
      if (err) {
        res.send(err);
      }
      res.send(foundTasks);
    });
  })
  .post((req, res) => {
    const data = req.body;
    let id = new mongoose.Types.ObjectId();
    const newTask = new Task({
      id: id,
      item: data.item,
      status: data.status,
      deadline: data.deadline,
      description: data.description,
    });
    newTask.save((err) => {
      if (err) {
        res.send(err);
      }
    });

    res.send(id);
  })
  .delete((req, res) => {
    Task.deleteMany({}, (err) => {
      if (!err) {
        res.status(200).send("success");
      } else {
        res.status(400).send("error");
      }
    });
  });

app
  .route("/task/:id")
  .patch((req, res) => {
    Task.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
      (err) => {
        if (!err) {
          res.status(200).send("success");
          console.log("sucess");
        } else {
          res.status(400).send("error");
          console.log(error);
        }
      }
    );
  })
  .delete((req, res) => {
    Task.deleteOne({ _id: req.params.id }, (err) => {
      if (!err) {
        res.status(200).send("success");
      } else {
        res.status(400).send("error");
      }
    });
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5500;
}

app.listen(port, function () {
  console.log("server listens at port 5500");
});
