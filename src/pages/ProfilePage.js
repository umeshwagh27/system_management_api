import Profile from '../components/User/Pofile';
import { Fragment,useState } from 'react';

const ProfilePage = () => {
 
  const [showEditForm,setEditForm]=useState(false);
  const toggleHandler=()=>{
    setEditForm((hideShowEditForm) => !hideShowEditForm);   


  };
 let user=localStorage.getItem('user');
 let userName=user.split(/[:,]+/)[5].replaceAll('"', ''); 
 let userEmail=user.split(/[:,]+/)[7].replaceAll('"', '');
 let userPhone=user.split(/[:,]+/)[9].replaceAll('"', '');


  return (
  <Fragment>
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'></div>
        <div className='col-md-8'>
        <h2>
          User Profile
        </h2>
        </div>        
      </div>
      <div className="row" style={{paddingTop:'25px'}}>       
        <div className='col-md-2'></div>
        <div className='col-md-4'>     
        
          <div className='form-group'>
          <label>User Name :</label>
          <label>{userName}</label>
          </div>

          <div className='form-group'>
          <label>Email:</label>
          <label>{userEmail}</label>
          </div>
          <div className='form-group'>
          <label>Phone:</label>
          <label>{userPhone}</label>
          </div>
         
        <div>
          <button className='btn btn-primary' style={{width:"200px"}} onClick={toggleHandler}>Edit</button>
        </div>
        </div>
        {showEditForm &&
        
        <div className='col-md-6'>
            <Profile />
        </div>
        }
        </div>
      
    </div>
    </Fragment>
  )
}

export default ProfilePage;