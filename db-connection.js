const mongoose = require("mongoose")
mongoose.set('strictQuery', false);
const db = mongoose.connect(process.env.DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
})
module.exports = db