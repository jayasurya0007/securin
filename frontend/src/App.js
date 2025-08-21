import axios from 'axios';
import { useEffect,useState} from 'react';

function App() {
  const [page,setPage]=useState(1);
  const [limit,setLimit]=useState(10);
  const [list,setList]=useState([]);
  const [search,setSearch]=useState({calories:"",title:"",rating:0});
  const [filter,setFilter]=useState([]);

  //to fetch the data from the /api/recipes using the using the params page,limit
  const fetchData = async () => {    
    const response = await axios.get("http://localhost:8080/api/recipes", {      
        params: { page:page,limit:limit}     
    });    
    setList(response.data);
    console.log(response.data);  
  }; 
  useEffect(() => {   
    console.log(page); 
    fetchData();  
  }, [page,limit]);

  const filterData = async () => {    
    const response = await axios.get("http://localhost:8080/api/recipes/search", {      
        params: {rating:search.rating,title:search.title}     
    });    
    setFilter(response.data);
    console.log(response.data);  
  }; 
  useEffect(() => {   
    console.log(page); 
    filterData();  
  }, [search]);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ padding: "20px" }}>
          <div>
            <label>Page Number</label>
            <input type='number' onChange={(e)=>{setPage(e.target.value)}}/>
            <label>Limit Number</label>
            <input type='number' onChange={(e)=>{setLimit(e.target.value)}}/>
          </div>      
                <h2></h2>
                    <ul>{list.map((user) => (          
                        <li key={user.id}> {user.title} <b>- Cuisine :</b> {user.cuisine} <b>— Rating: </b> {user.rating}          </li>        
                      ))}      
                    </ul>    
        </div> 
        <div>
          <label>Calories :</label>
          <input type='text' onChange={(e)=>{setSearch({calories:e.target.value})}}/>
          <label>Title Name :</label>
          <input type='text' onChange={(e)=>{setSearch({title:e.target.value})}}/>
          <label>Rating :</label>
          <input type='number' onChange={(e)=>{setSearch({rating:e.target.value})}}/>
          <button onClick={filterData}></button>
          <ul>{filter.map((user) => (          
                        <li key={user.id}> {user.title} <b>- Cuisine :</b> {user.cuisine} <b>— Rating: </b> {user.rating}          </li>        
                      ))}      
              </ul> 
        </div>
      </header>
    </div>
  );
}

export default App;
