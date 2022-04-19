import React from 'react';
  
class Register extends React.Component {
    constructor() {
    super();
    this.state = {
      input: {},  
      errors: {}
    };
     
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this); 
 }  
    handleChange(event) {
    let input = this.state.input;
    input[event.target.name] = event.target.value;  
    this.setState({
      input
    });
  }

  AddUser() {
    let errors = {};
    let body = {
        userName: this.state.input.userName,  
        email: this.state.input.email,  
        password: this.state.input.password,  
        confirmPassword: this.state.input.confirmPassword,     
    };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    };

    let baseurl = "https://localhost:44347/api/User/Register";
    fetch(baseurl, requestOptions)
        .then((res) => {
          if(res.Ok){
            alert("Welcome CMS");
            return res.json();
          }
          else if(res.status ===500) {
            errors["userName"] = "User Name Alerdy Exist Try Again";          
          }
          else if(res.status ===208) {
            errors["email"] = "Email Id Alerdy Exist Try Again"; 
          }
          this.setState({
            errors: errors
          });
      
         })
        .then((results) => {
            if (results) {             
                this.setState({
                    userName: '',
                    email: '',
                    password:'',
                    confirmPassword:'',                   
                })
            }
        })
        .catch((error) => {
           alert(error)
            console.error('error',error);
        });
   }
    handleSubmitForm(event) {
    event.preventDefault();
 
    if(this.validation()==false){
        
        let input = {};
        input["userName"] = this.state.input.userName;  
        input["email"] =this.state.input.email;
        input["password"] =  this.state.input.password;
        input["confirmPassword"] = this.state.input.confirmPassword;
        this.setState({input:input});
    }
    else{
      this.AddUser();
    }
  }  
  
  validation(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;
  
      if (!input["userName"]) {
        isValid = false;
        errors["userName"] = "Please enter your user name.";
      }
  
      if (!input["email"]) {
        isValid = false;
        errors["email"] = "Please enter your email Address.";
      }
  
      if (typeof input["email"] !== "undefined") {
          
        var pattern = new RegExp(/^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9_]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/i);
        if (!pattern.test(input["email"])) {
          isValid = false;
          errors["email"] = "Please enter valid email address.";
        }
      }
  
      if (!input["password"]) {
        isValid = false;
        errors["password"] = "Please enter your password.";
      }
  
      if (!input["confirmPassword"]) {
        isValid = false;
        errors["confirmPassword"] = "Please enter your confirm password.";
      }

      if (typeof input["password"] !== "undefined") {
        
      
      var regx=new RegExp("^(?=.*[0-9])"+ "(?=.*[a-z])(?=.*[A-Z])"+ "(?=.*[@#$%^&+=])" + "(?=\\S+$).{8,15}$");
      if(!regx.test(input["password"])){
          isValid = false;
          errors["password"] = "Minimum 8 characters at least 1 Uppercase Alphabet[A-Z], 1 Lowercase Alphabet[a-z] and 1 Number and 1 Special Character.(ex. A@123.com)";
      }
    }
  
      if (typeof input["password"] !== "undefined" && typeof input["confirmPassword"] !== "undefined") {
        
        if(input["password"] != input["confirmPassword"]) {
          isValid = false;
          errors["password"] = "Passwords don't match.";
        }
      } 
  
      this.setState({
        errors: errors
      });
  
      return isValid;
  }
     
  render() {
    return (
      <div className='container'>
    <div className='row'>
     <div className='col-md-4'>
        <h1>Registration Form</h1>
        <form onSubmit={this.handleSubmitForm}>
  
          <div className="form-group">
            <label >Enter User Name</label>
            <input 
              type="text" 
              name="userName" 
              value={this.state.input.userName}
              onChange={this.handleChange}
              className="form-control" 
              maxLength='30'
              placeholder="Enter name" 
              id="userName" />
  
              <div className="text-danger">{this.state.errors.userName}</div>
          </div>
  
          <div className="form-group">
            <label >Enter Email Address</label>
            <input 
              type="text" 
              name="email" 
              maxLength='100'
              value={this.state.input.email}
              onChange={this.handleChange}
              className="form-control" 
              placeholder="Enter email" 
              id="email" />
  
              <div className="text-danger">{this.state.errors.email}</div>
          </div>
   
          <div className="form-group">
            <label >Enter Password</label>
            <input 
              type="password" 
              name="password" 
              maxLength='40'
              value={this.state.input.password}
              onChange={this.handleChange}
              className="form-control" 
              placeholder="Enter password" 
              id="password" />
  
              <div className="text-danger">{this.state.errors.password}</div>
          </div>
  
          <div className="form-group">
            <label >Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={this.state.input.confirmPassword}
              onChange={this.handleChange}
              maxLength='40'
              className="form-control" 
              placeholder="Enter confirm password" 
              id="confirmPassword" />
  
              <div className="text-danger">{this.state.errors.confirmPassword}</div>
          </div>
              
          <input type="submit" value="Submit"  className="btn btn-success" />
        </form>
      </div>
      </div>
     </div>
    );
  }
}
  
export default Register;