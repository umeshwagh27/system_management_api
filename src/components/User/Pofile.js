// import React from 'react';
// import {render} from 'react-dom';
// class ChangePassword extends React.Component {
//     constructor() {
//     super();
//     debugger
//     let user=localStorage.getItem('user');
//     let userEmail=user.split(/[:,]+/)[7].replaceAll('"', '');
//     let userName=user.split(/[:,]+/)[3].replaceAll('"', '');
//     this.state = {
//       userName:userName,
//       email:userEmail,
//       password:'',
//       newPassword:''
//     };
     
//     this.handleChangeName = this.handleChangeName.bind(this);
//     this.handleChangeEmail=this.handleChangeEmail.bind(this);
//     this.handleSubmitForm = this.handleSubmitForm.bind(this); 
//  }  
//     handleChangeName(event) {  
//     this.setState({
//       userName:event.target.value.userName
    
//     });
//   }
//     handleChangeEmail(event) {  
//       this.setState({      
//         email:event.target.value.email,

//       });
//   } 
     
//     handleSubmitForm(event) {    
//     event.preventDefault();  

//     let user=localStorage.getItem('user');
//     let userId=user.split(/[:,]+/)[1].replaceAll('"','');
//     debugger;
//     let body = {
//       userName: this.state,
//       email: this.state,  
//       password:this.state.password,  
//       newPassword:this.state.newPassword,     
//   };

//   const requestOptions = {
//       method: "PUT",
//       headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//       },
//       body: JSON.stringify(body),
//   };
  
//   let baseurl = "https://localhost:44347/api/User/EditProfile/"+userId;
//   fetch(baseurl, requestOptions)
//       .then((res) => {
//           return res.json();
//       })        
//       .catch((error) => {
//           console.error('error',error);
//       });

//   };  
 
     
//   render() {
//     return (
//       <div className='container'>
//     <div className='row'>
//      <div className='col-md-4'>
      
//         <form onSubmit={this.handleSubmitForm}>
  
//           <div className="form-group">
//             <label >User Name</label>
//             <input 
//               type="text" 
//               name="userName" 
//               value={this.state.userName}
//               onChange={this.handleChangeName}
//               className="form-control" 
//               placeholder="Enter name" 
//               id="userName" />
  
//           </div>
  
//         <div className='form-group'>
//           <label htmlFor='email'>Email</label>
//           <input type='text'  className="form-control" id='email' placeholder='Enter Email'  value={this.state.email} onChange={this.handleChangeEmail} />
//         </div>
//        <div className='form-group'>
//           <label htmlFor='old-password'>Old Password</label>
//           <input type='password'  className="form-control" placeholder='Enter Old Password' id='old-password'  value={this.state.password}  />
//       </div>
//       <div className='form-group'>
//          <label htmlFor='new-password'>New Password</label>
//           <input type='password'  className="form-control" placeholder='Enter New Password' id='new-password' minLength="9"  value={this.state.newPassword}   />
//       </div>

//          <input type='submit' className='btn btn-success' value='save' />
         
//         </form>
//       </div>
//       </div>
//      </div>
//     );
//   }
// }
  
// export default ChangePassword;

import { useRef, useContext } from 'react';
import AuthContext from '../../tokenStore/auth-context';
import "bootstrap/dist/css/bootstrap.min.css";
import {Form,Container,Row} from 'react-bootstrap';

const Profile = () => {

  const oldPasswordInputRef = useRef();  
  const newPasswordInputRef = useRef();
  const userNameInputRef = useRef(); 
  const phoneInputRef = useRef(); 
  const emailInputRef = useRef();
  const authCtx = useContext(AuthContext);


  let user=localStorage.getItem('user');
  let userId=user.split(/[:,]+/)[1].replaceAll('"','');
  console.log(userId);
  let userName=user.split(/[:,]+/)[5].replaceAll('"', '');
  let userEmail=user.split(/[:,]+/)[7].replaceAll('"', '');
  let userPhone=user.split(/[:,]+/)[9].replaceAll('"', '');
  const submitHandler = (event) => {
    event.preventDefault();


    let body = {
      userName: userNameInputRef.current.value,
      email: emailInputRef.current.value,  
      phone: phoneInputRef.current.value,  
      password: oldPasswordInputRef.current.value,  
      newPassword:newPasswordInputRef.current.value,     
  };

  const requestOptions = {
    
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization :'Bearer '+authCtx.token,
         
      },
      body: JSON.stringify(body),
  };

  let baseurl = "https://localhost:44347/api/User/EditProfile/"+userId;
  fetch(baseurl, requestOptions)
      .then((res) => {
         if(res.ok)
         {
           alert("profile Updated Successfully ! Please Login Again")
           authCtx.logout()
         }

      })        
      .catch((error) => {
          console.error('error',error);
      });
  };

  return (
    <Container>
    <Row>
     <div className='col-md-8'>
    <form onSubmit={submitHandler}>
      <Form.Group>
        <Form.Label>User Name</Form.Label>
        <Form.Control id='user-name' maxLength='30' defaultValue={userName} ref={userNameInputRef} placeholder='Ener User Name' />
      </Form.Group>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control  id='email' maxLength='100' defaultValue={userEmail} placeholder='Enter Email Address' ref={emailInputRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Phone</Form.Label>
        <Form.Control  id='phone' maxLength='10' defaultValue={userPhone} minLength="10"  placeholder='Enter Phone Number' ref={phoneInputRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Old Password </Form.Label>
        <Form.Control  type='password' maxLength='40'  placeholder='Enter Old Password' id='old-password'  ref={oldPasswordInputRef} />
      </Form.Group>
      <Form.Group>
        <Form.Label>New Password </Form.Label>
        <Form.Control  type='password' maxLength='40'  placeholder='Enter New Password' id='new-password' minLength="9" ref={newPasswordInputRef} />
      </Form.Group>
   
      <div style={{paddingTop:'5px'}} >
        <button className='btn btn-success'>Save Changes</button>
      </div>
    </form>
    </div>
    </Row>
    </Container>
  );
};

export default Profile;