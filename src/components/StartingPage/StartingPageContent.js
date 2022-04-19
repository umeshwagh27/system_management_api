import React from 'react';
import {Modal,Button} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import Pagination from 'react-bootstrap-table2-paginator';
import Filter from 'react-bootstrap-table2-filter';
import BootstarpTable from 'react-bootstrap-table-next';

class StartingPageContent extends React.Component
{
  state={
    Items:[],
    columns:[
      {
      dataField: 'cR_Id',
      text: 'Car ID',
      hidden: true
      },
      {
        dataField: 'img',                
        text: 'Image',               
        formatter: (dataField)=> {
          var img = 'data:image/png;base64,' + dataField;
            return (<div>    
                <img src={img} height="100px" width="100px" /></div>    
            );
        }           
      },
      {
      dataField:'cR_Name',
        text:'Car Name',
        sort:true,
      },
      {
        dataField:'cR_Discription',
        text:'Discription',
        sort:true,
      },
      {
        dataField:'mO_Name',
        text:'Model Name',
        sort:true,
      },
      {
        dataField:'sM_Name',
        text:'SM Name',
        sort:true,
      }, 
      { 
        text:'Delete',
        formatter: (cell,row) => {
          return (
            <div>              
             <button className='btn btn-danger' onClick={()=>this.ShowDeleteModel(row.cR_Id)}>Delete</button>
            </div>                   
          );
        }       
      },
    
    ], 
    cR_Id:0,    
    isShowDeleteModel:false,
  }

  constructor(props){
    super(props);   
    this.deleteModelTrue=this.deleteModelTrue.bind(this); 
    this.deleteModelFalse=this.deleteModelFalse.bind(this); 
    this.ShowDeleteModel=this.ShowDeleteModel.bind(this); 

  }
  ShowDeleteModel=(id)=>{    
       
    if(id !==undefined){
      this.setState({isShowDeleteModel:true})
      this.setState({cR_Id:id})
    }
  }
  deleteModelFalse=()=>{
    this.setState({isShowDeleteModel:false})
  }
  deleteModelTrue=()=>{
    const requestOptionsDelete = {              
      method: "DELETE",
      headers: {
          Authorization :'Bearer '+ localStorage.getItem('token'),
          "Content-Type": "application/json",
          Accept: "application/json",
      },
    };    
      fetch(`https://localhost:44347/api/Car/RemoveCar/${this.state.cR_Id}`,requestOptionsDelete)        
      .then(res => {
        if(res.status==200){
          alert("Car Deleted Successfully");
          this.getList();
          this.setState({isShowDeleteModel:false})
        }
      })        
  }
componentDidMount=()=>{
  this.refreshList();
}
  refreshList=()=>{   
    debugger
    let tokens=localStorage.getItem('token');
    fetch('https://localhost:44347/api/Car/GetAllModel',{
    method:'GET',
    headers:{
         Authorization :'Bearer '+tokens
    },
    })        
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
        this.setState({Items:data});
     
    });    
};

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
          <div className='col-md-10'>
              <Modal show={this.state.isShowDeleteModel}  onHide={this.deleteModelFalse}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>  
                <div className='col-md-10'>
                    <div>
                    <strong><p>Are you sure you want to delete this Car?</p></strong>
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
       
          <BootstarpTable bootstrap4
                    columns={this.state.columns} 
                    keyField="cR_Id"
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
export default StartingPageContent;