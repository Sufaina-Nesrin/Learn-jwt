import {useState} from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import './App.css';

function App() {

const [user, setUser] = useState(null)
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(false);
const [success, setSuccess] = useState(false)

const refreshToken = async()=>{
  try{
  const res = await axios.post('/refresh',{token:user.refreshToken})
  setUser({
    ...user,
    accessToken:res.data.accessToken,
    refreshToken:res.data.refreshToken
  })
  return res.data
  }catch(err){

  }
}
const axiosJwt = axios.create()

axiosJwt.interceptors.request.use(
  async (config)=>{
    let currentDate = new Date();
    const decodedToken = jwt_decode(user.accessToken)
    if(decodedToken.exp *1000< currentDate.getTime()){
      const data = await refreshToken()
      config.headers["authorization"] = "Bearer "+data.accessToken 
    }
    return config
  },(error)=>{
    return Promise.reject(error)
  }
)



const handleSubmit = async(e)=>{
  e.preventDefault();
  try{
   const res = await axios.post("/login",{name,password})
   setUser(res.data)
  //  console.log(res.data)
   
  }catch(err){
   setError(true)
  }
} 

const handleDelete = async(id)=>{
setSuccess(false)
setError(false)
try{
 await axiosJwt.delete("/users/"+id, {
  headers:{authorization:"Bearer "+user.accessToken},
 })
setSuccess(true)
}catch(err){
setError(true)
}
}

if(user){


  return (
    <div className="App">
     
     <div className="dashBoard">
      <div className="container">
        <div className="titleContainer">
        <p className="title">Welcome to <b>{user.isAdmin?'admin':'user'}</b> dashboard</p>
        <p className="title2">Delete users</p>
        </div>
        <div className="buttonsDashboard">
          <button onClick={()=>{handleDelete("1")}}>Delete John</button>
        </div>
        <div className="buttonsDashboard">
          <button onClick={()=>{handleDelete("2")}}>Delete Jane</button>
        </div>
        {success &&(
          <span className="successRes">User has been deleted</span>
        )}
        {error && (
          <span className="errorRes">You cannot delete this user</span>
        )}
        </div>
      </div>
     </div>
  )}else{
    return(
      <div className="App">
      <form action="" onSubmit={handleSubmit} className="login">
          <div className="container">
            <h2 className="heading">LOGIN</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Username" className="name" />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="password" />
            <div className="button">
            <button type='submit' className="submitBtn">LOGIN</button>
            </div>
            
          </div>
         </form>
      </div>
         
    )
  }
  
   
 
}

export default App;
