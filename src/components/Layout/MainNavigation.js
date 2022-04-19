import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../tokenStore/auth-context';
import {Navbar,Nav,Container,NavDropdown} from 'react-bootstrap';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    // optional: redirect the user
  };

  return (

<div className="header">
  <Navbar bg="dark" variant="dark"  expand="lg">
      <Container>
      
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className='me-auto'>
          <Nav><Link  className="navbar-brand" >CMS</Link></Nav>
          
          {authCtx.isLoggedIn && authCtx.isAdmin && ( 
              <Nav><Link className="nav-link" to='/startingPage/StartingPage'>Home</Link></Nav>     
          )}
           {authCtx.isLoggedIn && authCtx.isAdmin && ( 
            <Nav><Link className="nav-link" to='/user/UserList'><span class="glyphicon glyphicon-user"></span> User</Link></Nav>
          )}

          {authCtx.isLoggedIn && authCtx.isAdmin && ( 
       
          <NavDropdown title="Cars">
            <NavDropdown.Item ><Link   to='/car/Car'>Car</Link></NavDropdown.Item>
            <NavDropdown.Item ><Link   to='/car/Model'>Model</Link></NavDropdown.Item>  
            <NavDropdown.Item ><Link   to='/car/SubModel'>Sub Model</Link></NavDropdown.Item>  
            <NavDropdown.Item ><Link   to='/car/Image'>Image</Link></NavDropdown.Item>  
          </NavDropdown>       
          )}             
         </Nav>
         <Nav>
          {!authCtx.isLoggedIn && ( 
              <Nav><Link className="nav-link" to='/user/Register'><span class="glyphicon glyphicon-user"></span> Register</Link></Nav>     
          )}
          {!authCtx.isLoggedIn && ( 
              <Nav><Link className="nav-link" to='/user/Login'><span class="glyphicon glyphicon-log-in"></span> Login</Link></Nav>    
          )}
          {authCtx.isLoggedIn && ( 
             <Nav flex><Link to='/user/Profile' className="nav-link">Profile</Link></Nav>
          )}
          {authCtx.isLoggedIn && ( 
             <button className="btn navbar-btn btn-primary" onClick={logoutHandler}><span class="glyphicon glyphicon-lock"></span>Logout</button>
          )}
        </Nav>  
        </Navbar.Collapse>
      </Container>
  </Navbar>
</div>

    // <nav className="navbar navbar-inverse">
    // <div className="container-fluid">
    //  <div className="navbar-header">
    //     <Link  className="navbar-brand" to='/Home'>CMS</Link>    
    //   </div> 
    //   <ul className="nav navbar-nav">       
    //       <li className="active">
    //           <Link  className="nav-link" to='/Home'>Home</Link>
    //       </li>   
         
    //      {authCtx.isLoggedIn && authCtx.isAdmin && (
    //         <li >
    //           <Link  className="nav-link" to='/Car'>Car</Link>
    //         </li>
    //       )}
    //      {authCtx.isLoggedIn && authCtx.isAdmin && (
    //         <li >
    //           <Link  className="nav-link" to='/Model'>Model</Link>
    //         </li>
    //       )}

    //     </ul>
    //     <ul class="nav navbar-nav navbar-right">
    //       {!isLoggedIn && (
    //         <li>
    //           <Link to='/user/Register'><span class="glyphicon glyphicon-user"></span> Register</Link>
    //         </li>
    //       )}
    //       {!isLoggedIn && (
    //         <li >
    //           <Link to='/user/Login'><span class="glyphicon glyphicon-log-in"></span> Login</Link>
    //         </li>
    //       )}
          
    //       {authCtx.isLoggedIn && (
    //         <li>
    //           <Link to='/user/Profile'>Profile</Link>
    //         </li>
    //       )}
    //       {isLoggedIn && (
    //         <li>
    //           <button className="btn navbar-btn btn-primary" onClick={logoutHandler}><span class="glyphicon glyphicon-lock"></span>Logout</button>
    //         </li>
    //       )}
    //     </ul>
    //     </div>

    //   </nav>


  );
};

export default MainNavigation;