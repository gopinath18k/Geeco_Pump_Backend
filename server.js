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

// Connect MongoDB

mongoose.connect("mongodb://localhost:27017/pump-warranty")
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
    pumpModel:String
})

// After Declered Schema 
// Create MondoDB Model
// store the Model to new Variable
const pumpwarrantyModel=mongoose.model("PumpWarranty",pumpwarrantyschema)

//Push The Data From Postman to MongoDB
//Create New Data

app.post('/pumpwarranty',async(req,res)=>{
    const {pumpName,pumpModel}=req.body;
    
    try{
        const newPumpWarranty =new pumpwarrantyModel({pumpName,pumpModel});
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
        const {pumpName,pumpModel}=req.body;
        const id=req.params.id;
        const updatedPumpWarranty=await pumpwarrantyModel.findByIdAndUpdate(
            id,
            {pumpName,pumpModel},
            {new:true}
        )
        if(!updatedPumpWarranty){
            return res.status(404).json({message:"UpdatedP Pump Warramty Not Found"})
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

const port =8000;

app.listen(port,()=>{
    console.log("Server is listenting to port"+port)
})