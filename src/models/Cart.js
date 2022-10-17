const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  code:{
    type:String,
    required:true,
    unique:true,
  },
  price: {
    type: Number,
    required: true,
  },
  email:{
    type: String,
    required:true,  
    unique:true,
  },
  name:{
    type: String,
    required:true,
    unique:true,
  }
},
  {
    timestamps: true,
  }
);

export default mongoose.model("carrinho", schema);