// Express.JS Import
const express = require("express");

// MongoDB Import
const mongoose=require("mongoose");

const cors = require('cors')


// Assign Variable to Express
const app=express();


// Receive Data Via API Postman in JSON Format

app.use(express.json());
app.use(cors());

// Load Environment Variables
require("dotenv").config();

// Connect MongoDB

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pump-warranty")
.then(()=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log(err)
})

// MongoDB Schema (Means =Declered  What data and Data type)

const pumpwarrantyschema=new mongoose.Schema({
    pumpName:{
        required:true,
        type:String
    },
    pumpModel:String,
    invoiceNo:String,
    invoiceDate:String,
    warrantyYear:String,
    warrantyExpiry:String
})


const pumpwarrantyModel=mongoose.model("PumpWarranty",pumpwarrantyschema)



app.post('/pumpwarranty',async(req,res)=>{
    const {pumpName,pumpModel,invoiceNo,invoiceDate,warrantyYear,warrantyExpiry}=req.body;
    
    try{
        const newPumpWarranty =new pumpwarrantyModel({pumpName,pumpModel,invoiceNo,invoiceDate,warrantyYear,warrantyExpiry});
        await newPumpWarranty.save();
        res.status(201).json(newPumpWarranty)
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }

})

//Get The Data From MongoDB to Postman

app.get("/pumpwarranty",async (req,res)=>{
    try{
        const newPumpWarranty= await pumpwarrantyModel.find();
        res.json(newPumpWarranty);
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})

//Update the Data & Send Postman to DB

app.put("/pumpwarranty/:id",async (req,res)=>{
    try{
        const {pumpName,pumpModel,invoiceNo,invoiceDate,warrantyYear,warrantyExpiry}=req.body;
        const id=req.params.id;
        const updatedPumpWarranty=await pumpwarrantyModel.findByIdAndUpdate(
            id,
            {pumpName,pumpModel,invoiceNo,invoiceDate,warrantyYear,warrantyExpiry},
            {new:true}
        )
        if(!updatedPumpWarranty){
            return res.status(404).json({message:"Updated Pump Warranty Not Found"})
        }
        res.json(updatedPumpWarranty)

    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})

//Delete the Data & Send Postman to DB

app.delete("/pumpwarranty/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        await pumpwarrantyModel.findByIdAndDelete(id)
        res.status(204).end();
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})

// Start The Server

const port = process.env.PORT || 8000;

app.listen(port,()=>{
    console.log("Server is listenting to port "+port)
})