const express = require("express")
const mongoose = require('mongoose');
const superagent = require('superagent')
const Comment = require("./model/comment")
const User = require("./model/user")
const { Validator } = require('node-input-validator');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express()

app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb"
  })
)

app.use(express.json())

mongoose.connect('mongodb+srv://2mighty:phil4verse13@cluster0.n9vjh.mongodb.net/blog_everyone', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected");
});

app.get("/comments", async (req, res) => {
  const response = await superagent
    .get("http://jsonplaceholder.typicode.com/comments")

  const result = JSON.parse(response.text)

  Comment.insertMany(result, (err) => {
    console.log(err);
    if(err) return res.status(422).json({message: "Something went wrong"})
    return res.status(200).json({message: 'Inserted', result})
  })
})

app.get("/comments/all", async (req, res) => {
    const comments = await Comment.find({})
    return res.status(200).json({message: 'All Comments', comments})
})

app.get("/feature1", async (req, res) => {
    return res.status(200).json({message: 'Testing Feature 1'})
})

app.post("/register", async (req, res) => {
  try {
    const v = new Validator(req.body, {
      email: 'required|email',
      password: 'required',
      fullname: 'required',
      phone: 'required',
    });

    const matched = await v.check();
    if (!matched) return res.status(422).json({message: "Validation Error", errors: v.errors})

    req.body.password = bcrypt.hashSync(req.body.password, saltRounds)
    const userDetails = {email, fullname, phone, password} = req.body

    const user = new User(userDetails)
    await user.save()
    return res.status(200).json({message: 'User Saved', user})
  } catch (err) {
    console.log(err);
    return res.status(422).json({message: 'Something went wrong', error: err})
  }
})

module.exports = app