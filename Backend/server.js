const express = require('express');
const app = express();
const PORT=5000;
const mongoose = require('mongoose');

app.use(express.json());

//DB artifical for dev
mongoose.connect('mongodb://127.0.0.1:27017/myDB').then(()=> {
    console.log("DB connected Successfully!! ");
}).catch((error) => {
    console.log(error);
});

//User schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
     email:{
        type:String,
        require:true,
    },
     password:{
        type:String,
        require:true,
    },
},{timestamps:true});

const User= mongoose.model("User",userSchema);

//Create user
app.post("/createuser", async (req,res)=>{
    try {
       const bodyData=req.body;
       const user=new User(bodyData);
       const userData=await user.save();
       res.send(userData);

    } catch (error) {
        res.send(error);
    }
})

//Get all data 
app.get("/readalluser", async(req,res) => {
    try {
      const userData= await User.find({});
      res.send(userData);
    } catch (error) {
      res.send(error);
    }
})

//Get data by ids
app.get("/read/:id",async(req,res) => {
    try {
       const id=req.params.id;
       const user= await User.findById({_id:id});
       res.send(user);
    } catch (error) {
       res.send(error); 
    }
})

//update user 
app.put("/updateuser/:id",async(req,res)=>{
    try {
       const id=req.params.id;
       const user= await User.findByIdAndUpdate({_id:id},req.body,{new:true});
       res.send(user);
    } catch (error) {
      res.send(error);
    }
})

//delete by id
app.delete("/deleteuser/:id",async(req,res)=>{
    try {
       const id=req.params.id;
       const user=await User.findByIdAndDelete({_id:id});
       res.send(user); 
    } catch (error) {
        res.send(error); 
    }
})

app.get('/',(req,res) => {
    console.log("Res is this /");
    res.send(`<h1>Hi welcome app page</h1>`);
})


app.listen(PORT , ()=> {
    console.log(`Server is running in ${PORT} `)
})