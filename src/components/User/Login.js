import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../tokenStore/auth-context';


const Login = () => {
  const history = useHistory();
  const userNameInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const[userName,checkUserEmpty]=useState();
  const[password,checkPasswordEmpty]=useState();

  const Log=(event) =>{

    const enteredUserName = userNameInputRef.current.value;  
    const enteredPassword = passwordInputRef.current.value;  
     
    fetch('https://localhost:44347/api/User/Login', {
      method: 'POST',  
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
      body: JSON.stringify({
        userName: enteredUserName,      
        password: enteredPassword,      
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async(res) => {
       
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'User Name or Password Incorrect';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
      
        authCtx.login(data.token);
        authCtx.user(data.user);
        console.log(localStorage.getItem("user"));
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const submitHandler=(event) =>{
    event.preventDefault();
    if(validation()==false){  
    }
    else{
      Log();
    }
  }; 
  const validation=()=>{
      let isValid = true;
      if (!userNameInputRef.current.value ) {
        isValid = false;
        checkUserEmpty("Please enter your user name.");
      }  
      else
      { 
        isValid = true;
        checkUserEmpty('');

      }
      if (!passwordInputRef.current.value) {
        isValid = false;
        checkPasswordEmpty("Please enter password.");
      }
      else{
        isValid = true;
        checkPasswordEmpty('');
      }
       return isValid;
    } 
  return (
    <div className='container'>
    <div className='row'>
     <div className='col-md-4'>
        <h1>Login</h1>
    
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor='userName'>User Name</label>
          <input type='userName' placeholder='User Name' maxLength='30' className="form-control"  id='userName'  ref={userNameInputRef} />
          <div className="text-danger">{userName}</div>
        </div>
        <div className='text-denger'></div>
        <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            type='password' id='password' placeholder='Password' maxLength='40' className="form-control" ref={passwordInputRef}/>
            <div className="text-danger">{password}</div>
        </div>      
        <div className="form-group">
          <button   className="btn btn-success" >Login</button>
        </div>
      </form>
      </div>
       </div>
      </div>
  );
};

export default Login;
