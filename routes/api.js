/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");
const BookModel = require("../model").Book;
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    //  console.log(req)
    //  const title = req
    //  if(!title){
    //    res.json({error:"missing required field title"})
    //  }

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let book_title = req.body.title;
      console.log(book_title)
      if(!book_title){
         return res.json({error:"missing required field title"})
        }

       const newBook = new BookModel({
        title:book_title,
        created_on:new Date(),
        updated_on:new Date()
       }) 
       newBook.save(function (err) {
        if (err) {
          res.send("There was an error saving in post");
        } else {
          res.json(newBook);
        }
      });
       
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
