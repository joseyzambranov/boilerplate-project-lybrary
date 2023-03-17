const mongoose = require("mongoose");
const {Schema} = mongoose;

const BookShema = new Schema({
    title: {type:String,require:true},
     commentcount:{type:String}
});

const Book = mongoose.model("Book",BookShema);

exports.Book = Book;