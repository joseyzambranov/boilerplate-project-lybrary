const mongoose = require("mongoose");
const {Schema} = mongoose;

const BookShema = new Schema({
    title: {type:String,require:true},
     commentcount:{type:String},
     created_on:Date,
     updated_on:Date
});

const Book = mongoose.model("Book",BookShema);

exports.Book = Book;