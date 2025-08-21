import express from 'express';
import { Sequelize,DataTypes,Op } from 'sequelize';
import cors from 'cors';

const sequelize = new Sequelize('recipes', 'root', 'Jaya@2004', { host: 'localhost', dialect: 'mysql' });

const app=express();

app.use(express.json());

//To allow the frontend to fetch from backend endpoints
app.use(cors());

//Table Schema Model 
const Recipe = sequelize.define('Item', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4,primaryKey: true },
  cuisine: { type: DataTypes.STRING},
  title:{type:DataTypes.STRING},
  rating:{type:DataTypes.FLOAT},
  prep_time:{type:DataTypes.INTEGER},
  cook_time:{type:DataTypes.INTEGER},
  total_time:{type:DataTypes.INTEGER},
  description:{type:DataTypes.TEXT},
  nutrients:{type:DataTypes.JSON},
  serves:{type:DataTypes.STRING}
}, { timestamps: true });

//initial endpoint which sends the all the data
app.get("/",async (req,res)=>{
    res.send(await Recipe.findAll());
})

//filter recipes based on limit ans page number
app.get("/api/recipes", async (req,res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 10;
    const offset =(page-1)*limit;
    //Recipe.sort((a,b)=>b.rating-a.rating);   --> Already Sorted the data in importData.js itself. 
    const users = await Recipe.findAll({
        offset: offset,
        limit: limit,
        raw: true});
    res.send(users);
});

//filter recipes based on rating and calories
app.get("/api/recipes/search",async (req,res)=>{
    const rating=parseInt(req.query.rating) || 0;
    const calories=req.query.calories || "";
    const title=req.query.title || "";
    console.log(rating);
    console.log(calories);
    let whereCondition ={rating: { [Op.lte]:rating},title:{[Op.eq]:title}};
    // if(calories=="" && title=="" && rating!=0){
    //     whereCondition ={rating: { [Op.lte]:rating}};
    // }  
    // if(calories=="" && rating==0 && title!=""){
    //     whereCondition ={title: { [Op.eq]:title}};
    // }  
    // if(calories!="" && rating==0 && title==""){
    //     whereCondition ={calories: { [Op.eq]:calories}};
    // }
    //calories --> calories is not number
    //e.nutrients.calories.split(" ")[0] 
    const users = await Recipe.findAll({where: whereCondition,raw:true});
    res.json(users);
}) 

//Additionally
//filter recipes based on cuisine only
app.get("/api/recipes/search/cuisine/:cuisine",(req,res)=>{
    const cuisine=req.params.cuisine;
    console.log(cuisine);
    let filter=sampleData.filter(e=>{
        return e.cuisine==cuisine;
    })
    res.send(filter);
})  

//Additionally
//filter recipes based on rating only
app.get("/api/recipes/search/rating/:rating",(req,res)=>{
    const rating=req.params.rating;
    console.log(rating);
    let filter=sampleData.filter(e=>{
        return e.rating<=rating;
    })
    res.send(filter);
})  

//Additionally
//filter recipes based on calories only
app.get("/api/recipes/search/calories/:calories",(req,res)=>{
    const calories=req.params.calories;
    console.log(calories);
    let filte=sampleData.map(e=>{
        let result=[];
        if(e.nutrients.calories){
            let cal=parseInt(e.nutrients.calories.split(" ")[0]);
            if(cal!=null){
                console.log(cal);
            if(cal>calories){
                result.push(e);
            }
            }
        }
        return e;
    })
    res.send(filte);
});

app.listen(8080,()=>{ console.log("Running at port 8080");})