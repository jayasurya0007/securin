import { readFile } from 'fs/promises';
import fs from 'fs';
import { Sequelize,DataTypes } from 'sequelize';

//Connection to the database 
const sequelize = new Sequelize('recipes', 'root', 'Jaya@2004', { host: 'localhost', dialect: 'mysql' });

//Table Schema Model 
export const Recipe = sequelize.define('Item', {
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

//parsing the data from the json file and storing to the sql database 
const importData = async () => {
  try {
   await sequelize.sync();
    const data = JSON.parse(await readFile('./data/US_recipes_null.json', 'utf8'));
    const sampleData=Object.values(data);
    //Sorting the data based on the rating and storing in the db 
    sampleData.sort((a,b)=>b.rating-a.rating);
    for (const recipe of sampleData) {
      await Recipe.findOrCreate({
        where: { title: recipe.title}, 
        defaults: recipe
      });
    }
    sampleData.sort((a,b)=>b.rating-a.rating);
    console.log('Data imported');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
};

importData();
