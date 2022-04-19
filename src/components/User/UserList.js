import React,{Component} from 'react';
import {Modal,Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import Pagination from 'react-bootstrap-table2-paginator';
import Filter from 'react-bootstrap-table2-filter';
import BootstarpTable from 'react-bootstrap-table-next';

class UserList extends Component
{

  state={
    Items:[],
    columns:[
      {
      dataField: 'id',
      text: 'User Id',
      hidden: true
      
      },
      {
        dataField:'userName',
        text:'User Name',
        sort:true,
      },
      {
        dataField:'email',
        text:'Email',
        sort:true,
      },
      {
        dataField:'phone',
        text:'Phone',
        sort:true,
      },
      {
        dataField:'role',
        text:'Role',
        sort:true,
      },
 
      {
        text:'Activate/Deactivate',
        formatter: (cell,row) => {
          return (
            <div>
                <input type="checkbox"  className="toggle" defaultChecked={row.lockoutEnabled} value={row.id} onChange={this.checkBoxHandle}   />
   
            </div>
          );
        }
      },
      { 
        text:'Delete',
        formatter: (cell,row) => {
          return (
            <div>              
             <button className='btn btn-danger'  onClick={()=>this.ShowDeleteUserModel(row.id)}>Delete</button>
            </div>                   
          );
        }       
      }
    ],
      id:0,
      userName:"",
      email:"", 
      role:"",
      isShowDeleteModel:false
  }

  constructor(props){
        super(props);     
   
        this.checkBoxHandle=this.checkBoxHandle.bind(this); 
        this.deleteModelTrue=this.deleteModelTrue.bind(this); 
        this.deleteModelFalse=this.deleteModelFalse.bind(this); 
        this.ShowDeleteUserModel=this.ShowDeleteUserModel.bind(this);      
    }
    deleteModelTrue=(e)=>{
    
      const requestOptionsDelete = {
          method: "DELETE",
          headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
              "Content-Type": "application/json",
              Accept: "application/json",
          },
      };
      fetch(`https://localhost:44347/api/User/RemoveUser/${this.state.id}`, requestOptionsDelete)
          .then(res => {
              if (res.status == 200) {
                  alert("User Deleted Successfully");
                  this.refreshList();
                  this.setState({ isShowDeleteModel: false })
              }
          })
    }
    deleteModelFalse=()=>{
        this.setState({isShowDeleteModel:false})
    }    
    ShowDeleteUserModel=(id)=>{
     debugger
     this.setState({id:id});
        this.setState({isShowDeleteModel:true});
      
    }  
    checkBoxHandle=(event)=>{
        debugger
        let tokens=localStorage.getItem('token');
        fetch(`https://localhost:44347/api/User/ActiveDeactiveUser/${event.target.value}`,{
        method:'POST',
        headers:{
             Authorization :'Bearer '+tokens
        },
        })              
    };
    componentDidMount=()=>{
      this.refreshList();
    }
    refreshList=()=>{   
      debugger
    let tokens=localStorage.getItem('token');
    fetch('https://localhost:44347/api/User/GetUserDetail',{
    method:'GET',
    headers:{
         Authorization :'Bearer '+tokens
    },
    })        
    .then(response=>response.json())
    .then(data=>{   
        this.setState({Items:data});   
    })
}          
                                
onChangeSearch=(event)=>{  
  
       fetch(`https://localhost:44347/api/User/GetUserFilters?search=${event.target.value}`,{
       method:'GET'})        
      .then(response=>response.json())
      .then(data=>{    
          this.setState({Items:data});
      });   
    }   
  render(){
    const option = {  
      
                  page: 0,   
                  sizePerPageList: [ {  
                    text: '5', value: 5  
                  }, {  
                    text: '10', value: 10  
                }, {  
                    text: 'All', value: this.state.Items.length  
                  }],  
                  sizePerPage: 5,  

                  pageStartIndex: 0,   

                  paginationSize: 3,    

                  prePage: 'Prev',   

                  nextPage: 'Next',   

                  firstPage: 'First',   

                  lastPage: 'Last',                  

                };  
                
    return (
      <div className="container">     
        <div className='row'>
            
                <div className='col-md-12' style={{ paddingTop: "5px" }}>  
                    <Modal show={this.state.isShowDeleteModel}  onHide={this.deleteModelFalse}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>  
                        <div className='col-md-10'>
                            <div>
                            <strong><p>Are you sure you want to delete this Model?</p></strong>
                            </div>
                            <div style={{paddingTop:'10px'}}>
                            <Button onClick={this.deleteModelTrue} style={{marginLeft:'5px'}}>Yes</Button>  
                            <Button onClick={this.deleteModelFalse} style={{marginLeft:'5px'}}>No</Button>                                   
                            </div> 
                        </div>
                        </Modal.Body>
                    </Modal>
                </div>
            <div className='col-md-12'>      
                
             <input type="text" onChange={this.onChangeSearch.bind(this)}  style={{float:'right',width:'20%'}}/>
              <BootstarpTable bootstrap4
              columns={this.state.columns} 
              keyField="id"
              data={this.state.Items}
              hover
              striped
              pagination={Pagination(option)}
              filter={Filter()}
            />        
          </div>
        </div>       
      </div>
    );
  }
}
export default UserList;
