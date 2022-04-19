import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  isAdmin:false,
  isUser:false,
  login: (token) => {},
  logout: () => {},
});

const getToken = () => {
  const storedToken = localStorage.getItem('Bearer '+'token');
};
const getUser = () => {
  const storedUser = localStorage.getItem('user');
};

export const AuthContextProvider = (props) => {

  const tokenData = getToken();
  const userData = getUser();  
  let initialToken;
  let initialUser;

  if (tokenData) {
    initialToken = tokenData.token;
  }
  if(userData)
  {
    initialUser=userData.user;
  }
 
  const[role,getRole]=useState();
  const [token, setToken] = useState(initialToken);
  const [user, setData] = useState(initialUser);
  const userIsLoggedIn = !!token;
  if(role=='Admin')
  {
    var roleIsAdmin=!!role;
  }
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token',token );
  };

  const userHandler=(user)=>{   
    setData(user);
    localStorage.setItem('user',JSON.stringify(user))  
      let users=localStorage.getItem('user');
      var getRol=users.split(/[:,}]+/)[11].replaceAll('"', '');
      console.log(getRol);
      getRole(getRol);
    
  }; 
  
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user:userHandler,    
    isAdmin:roleIsAdmin,
 
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
