// Requisição <->/transactions <-> Controller.create <->Service <->API /Gateway



const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    cartcode: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["Started", "Processing", "pending", "approved", "refused", "refunded", "chargeback", "error"],
        required: true,
    },
    paymentType: {
        type: String,
        enum:["billet","credit_card","pix"],
        
    },
    installments:{
        type:Number,
    },
    total:{
        type:Number,
    },
    transactionId:{
        type:String,
    },
    processorResponse:{
        type:String,
    },
    customer_id:{
      type:String,
    },
    customerEmail:{
        type:String,
    },
    customerName:{
        type:String,
    },
    customerMobile:{
        type:String,
    },
    customerDocument:{
        type:String,
    },
    billingAddress:{
        type:String,
    },
    billingNumber:{
        type:String,
    },
    billingNeighborhood:{
        type:String,
    },
    billingCity:{
    type:String, 
    },
    billingZipCode:{
        type:String,
    },
    billingState:{
        type:String,
    },
},
    {
        timestamps: true,
    }
);

export default mongoose.model("transaction", schema);