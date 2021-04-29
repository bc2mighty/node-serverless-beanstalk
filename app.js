const express = require("express")
const mongoose = require('mongoose');
const superagent = require('superagent')
const Comment = require("./model/comment")

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

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});