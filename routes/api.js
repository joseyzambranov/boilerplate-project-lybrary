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
const { ObjectID } = require('mongodb');
module.exports = function (app) {

  app.route('/api/books')
  .get(function (req, res){
    BookModel.find({}, function(err, books) {
      if (err) {
        return res.status(500).json({error: err.message});
      }
      const bookList = [];
      books.forEach(function(book) {
        const comments = book.commentcount.map(function(comment) {
          return comment;
        });
        bookList.push({_id: book._id, title: book.title,comments:comments, commentcount: comments.length});
      });
      return res.json(bookList);
    });
  })

    .post(function (req, res){
      let book_title = req.body.title;
      if(!book_title){
         return res.json("missing required field title")
        }

       const newBook = new BookModel({
        title:book_title
       }) 
       newBook.save(function (err) {
        if (err) {
          res.send("There was an error saving in post");
        } else {
          const response = {
            _id: newBook._id,
            title: newBook.title
          }
          res.json(response);
        }
      });
       
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      BookModel.deleteMany({},function(err){
        if(err){
          return res.status(500).json({error:err.message})
        }
        return res.json("complete delete successful")
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      BookModel.aggregate([
        {$match:{_id:mongoose.Types.ObjectId(bookid)}},
        {$group:{_id:"$_id",title:{$first:"$title"},comments:{$push:"$commentcount"}}}
      ]).exec((err,result)=>{
        if(err){
          return res.status(500).json({error:err.message})
        }
        if(!result||result.length == 0){
          return res.json("no book exists")
        }
        const book = result[0]
        return res.json({
          _id:book._id,
          title:book.title,
          comments:book.comments
        })
        
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment){
        return res.json("missing required field comment")
      }
      BookModel.updateOne(
        {_id:mongoose.Types.ObjectId(bookid)},
        {$push:{"commentcount":comment}}
        ).exec((err,result)=>{
          if(err){
            return res.status(500).json({error:err.message})
          }
          if(result.matchedCount==0){
            return res.json("no book exists")
          }
          if(result){
            BookModel.aggregate([
              {$match:{_id:mongoose.Types.ObjectId(bookid)}},
              {$group:{_id:"$_id",title:{$first:"$title"},comments:{$push:"$commentcount"}}}
            ]).exec((err,result)=>{
              if(err){
                return res.status(500).json({error:err.message})
              }
              if(!result||result.length == 0){
                return res.json("no book exists")
              }
              const book = result[0]
              return res.json({
                _id:book._id,
                title:book.title,
                comments:book.comments.flat()
              })
              
            })
          }
        })
      //json res format same as .get
        
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      BookModel.findByIdAndDelete(bookid,function(err,deleteBook){
        if(err){
          return res.status(500).json({error:err.message})
        }
        if(!deleteBook){
          return res.json("no book exists")
        }
        return res.json("delete successful")
      })
      //if successful response will be 'delete successful'
    });
  
};
