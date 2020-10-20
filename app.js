//////*Using the Node framework of javascript/////////
//////Bring in Libraries from npm(online repo of node moddules/libraries)//////
const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
/////Bring in local modules///////////////
const date = require(__dirname + "/date.js");
////////////////////////////////////////Create the app object to use EXPRESS.JS//////////////////////////////////////////
const app = express();
app.listen(3000, function() {
  console.log("Server started on port 3000");  //FIRE UP THE SERVER on port 3000!!!!
});
app.set('view engine', 'ejs');  ///requires "views" folder in project
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
/////////////////////////////////////////////Set-up/create your MONGODB DATABASE////////////////////////////////////////////
const url = 'mongodb://localhost:27017'; //database connection URL
const dbName = 'todolistDB'; //database dbName
const client = new MongoClient(url, {useUnifiedTopology: true});//create a new instance of MongoClient
//initialize global variables
var db;
var collection;
////////////////////CONNECT your database(Client) to this SERVER via port 27017////////////////////////
client.connect(function(err){
  assert.equal(null, err);
  console.log("Mongodb connected successfully to the server via port 27017");
  db = client.db(dbName); //assign db object
  collection = db.collection('items'); //assign the collection
});
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
////////////////////////MongoDB insert Method///////////////////////////////////
const insertDefaults = function(db, callback){
  //insert some objects
  collection.insertMany([
    {
      name:"Item 1",
    },
    {
      name: "Item 2",
    },
    {
      name: "Item 3",
    }
  ],
    function(err, result){
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    defaultListSize = 3
    callback(result);
    }
  );
};
/////////////////////////////////////////////////////////////////////////////////
////////Load the home page "list.ejs" (lists.ejs "gets" "/" from app.js)/////////
app.get("/", function(req, res) {
  collection.find({}).toArray(function(err,foundItems){
    if (foundItems.length === 0){
      insertDefaults(db);//if list is empty insert defaults
      console.log("successfully inserted defaults into the collection");
      res.redirect("/");
    } else {
      assert.equal(err,null);
      console.log("successfully found " + foundItems.length + " items");
      console.log(foundItems);
      /////function from date.js////////
      // let day = date.getDay();
      //Express (using ejs) finds & edits the lists.ejs file
      res.render("list",{listTitle: "Today", newListItems: foundItems});//if list is not empty render foundItems
    }
  });
});
////////////////////////////////////////////////////////////////////////////////
// ///////////////////Express custom route///////////////////////////////////
// app.get("/:customListName", function(req,res){
//   var defaultArr;
//   collection = db.collection('defaults');
//   collection.find({}).toArray(function(err,foundItems){
//     assert.equal(err,null);
//     if (foundItems.length === 0){
//       insertDefaults(db);//if list is empty insert defaults
//     }
//     defaultArr = foundItems;
//   });
//   const customListName = req.params.customListName;
//   collection = db.collection('lists');
//   const list = { name: customListName, item: defaultArr };
//   collection.insertOne(list, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//   });
// });
// //////////////////////////////////////////////////////////////
const findDocuments = function(db, callback) {
  // Get the documents collection
  collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
}
////////////////////////////////////////////////////////////////////////////////
////For when a user posts the input "newItem" via the html form "itemInput" (list.ejs)
app.post("/", function(req, res){
  const itemName = req.body.newItem;
  collection.insert({name: itemName});
  res.redirect("/");
});
// /////if the post came from the work page//////////
//   if(req.body.list === "Work"){
//     workItems.push(item);////add to the work page lis
//     res.redirect("/work");////send user back to work page
// //////the post came from the home page/////
//   }else{
//     items.push(item);////add to the home page list
//     res.redirect("/");////send user back to home page
//   }
app.post("/delete", function(req, res){
  const checkedItemID = req.body.checkbox;
  collection.deleteOne({ _id: ObjectId(checkedItemID)}, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed a document");
    res.redirect("/");
  });
});

/////////////////////////////////////////////////////////////////////////////////
////////Load the Work page "list.ejs" (lists.ejs "gets" "/work" from app.js)/////////
app.get("/work", function(req, res){
  res.render("list",{listTitle: "Work List", newListItems: workItems});
});
//////////////////////////////////////////////////////////////////////////////////

app.get("/about", function(req, res){
  res.render("about");
});
