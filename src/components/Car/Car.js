import React,{Component,useContext} from 'react';
import {Modal,Button} from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import Pagination from 'react-bootstrap-table2-paginator';
import Filter from 'react-bootstrap-table2-filter';
import BootstarpTable from 'react-bootstrap-table-next';

class Car extends Component
{
  search=[];  

  state={
    Items:[],
    columns:[
      {
        dataField: 'cR_Id',
        text: 'Car ID',
        hidden: true      
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
        text:'Edit',
        formatter: (cell,row) => {          
          return (
            <div>
              <button  onClick={()=>this.showModal(row.cR_Id,row.cR_Name,row.cR_Discription)}  className='btn btn-warning'>Edit</button>      
            </div>
          );
        }
      },
      { 
        text:'Delete',
        formatter: (cell,row) => {
          return (
            <div>              
             <button className='btn btn-danger'  onClick={()=>this.ShowDeleteCarModel(row.cR_Id)}>Delete</button>
            </div>                   
          );
        }       
      }
    ],
      cR_Id:0,
      cR_Name:"",
      cR_Discription:"", 
      isShow:false,
      description:"",
      errorDescription:"",
      errorCarName:"",
      carName:'',
      isShowDeleteCarModel:false,
      ckValue :[],  
  }
    constructor(props){
    super(props);     
    this.getList();       
    this.showModal=this.showModal.bind(this);     
    this.hideModal();
    this.deleteCarModelTrue=this.deleteCarModelTrue.bind(this); 
    this.deleteCarModelFalse=this.deleteCarModelFalse.bind(this); 
    this.ShowDeleteCarModel=this.ShowDeleteCarModel.bind(this); 
    this.handleCK=this.handleCK.bind(this);
    this.onChangeCarName=this.onChangeCarName.bind(this);
    this.handleSubmitForm=this.handleSubmitForm.bind(this);     
  }
    showModal=(id,name,discription)=>{     
      if(id === undefined){
        this.setState({isShow:true});
      } 
      else{   
        let tokens=localStorage.getItem('token');
        fetch(`https://localhost:44347/api/Car/GetCarById/${id}`,{
        method:'POST',
        headers:{
             Authorization :'Bearer '+tokens
          },
        })        
        .then(response=>response.json())
        .then(data=>{
            this.setState({cR_Name:name});
            this.setState({cR_Discription:discription});
       
             
        });  
        this.setState({cR_Id:id})  
        this.setState({isShow:true});    
      }
    }
    ShowDeleteCarModel=(id)=>{    
       
      if(id !==undefined){
        this.setState({isShowDeleteCarModel:true})
        this.setState({cR_Id:id})
      }
    }
    deleteCarModelFalse=()=>{
      this.setState({isShowDeleteCarModel:false})
    }
    deleteCarModelTrue=()=>{
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
            this.setState({isShowDeleteCarModel:false})
          }
        })        
    }
    hideModal=()=>{    
      this.setState({errorCarName:''});
      this.setState({cR_Name:''});
      this.setState({cR_Id:''});
      this.setState({cR_Discription:''});
      this.setState({errorDescription:''});
      this.setState({isShow:false});
    }
    onChangeCarName=(event)=>{
      this.setState({errorCarName:''})
    }
    handleCK=(event,editor)=>{
      debugger
        const data = editor.getData();
        this.setState({ ckValue:data });
        this.setState({errorDescription:''})
    }
    handleSubmitForm = (event,editor) => { 
        event.preventDefault(); 

        if (event.target.carName.value === "" || event.target.carName.value === undefined) 
        {
            this.setState({errorCarName:'Car Name is required'})
        } 
        else if (this.state.ckValue == "" || this.state.ckValue === undefined ) 
        {     
            this.setState({errorDescription:'Discription is required'})
        }
        else
        {
            let body = {
            cR_Name: event.target.carName.value, 
            cR_Discription:this.state.ckValue
            };                     
     
            if(this.state.cR_Id != ""){
              const requestOptionsPut = {              
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization :'Bearer '+ localStorage.getItem('token')
                },
                body: JSON.stringify(body),
            };  
              const baseurlPut = `https://localhost:44347/api/Car/EditCar/${this.state.cR_Id}`;
              fetch(baseurlPut, requestOptionsPut)
              .then((res) => {
                  if(res.ok)
                  {              
                      alert("Car Update Successfully");   
                      this.hideModal();  
                      this.getList();
                      this.setState({ckValue:[]})                 
                  }   
                  else
                  {
                      alert("Error Status :"+res.status+"\nFaild Please Try Again");   
                  } 
              })        
              .catch((error) => {
                  console.error('error',error);
              });
            }
            //Add Car
            else{
              const requestOptions = {              
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization :'Bearer '+ localStorage.getItem('token')
                },
                body: JSON.stringify(body),
            };  
            const baseurl = "https://localhost:44347/api/Car/AddCar";
            fetch(baseurl, requestOptions)
                .then((res) => {
                    if(res.ok)
                    {              
                        alert("Car Added Successfully");                       
                        this.hideModal();   
                        this.getList();  
                        this.setState({ckValue:[]})                 
                    }   
                    else
                    {
                        this.setState({errorCarName:'Car Name Alredy Exsist'})
                      //  alert("Error Status :"+res.status+"\nFaild Please Try Again");   
                    } 
                })        
                .catch((error) => {
                    console.error('error',error);
                });
           }
        }
    }
    getList=()=>{   
    let tokens=localStorage.getItem('token');
    fetch('https://localhost:44347/api/Car/GetCar',{
    method:'GET',
    headers:{
         Authorization :'Bearer '+tokens
    },
    })        
    .then(response=>response.json())
    .then(data=>{
        this.setState({Items:data});
        this.search=data;
    });    
};
onChangeSearch=(event)=>{    
    
       fetch(`https://localhost:44347/api/Car/GetCarDetail?search=${event.target.value}`,{
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
          <div className='col-md-12'>  
           <Modal show={this.state.isShowDeleteCarModel}  onHide={this.deleteCarModelFalse}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>  
                <div className='col-md-10'>
                    <div>
                    <strong><p>Are you sure you want to delete this Car?</p></strong>
                    </div>
                    <div style={{paddingTop:'10px'}}>
                      <Button onClick={this.deleteCarModelTrue} style={{marginLeft:'5px'}}>Yes</Button>  
                      <Button onClick={this.deleteCarModelFalse} style={{marginLeft:'5px'}}>No</Button>                                   
                    </div> 
                </div>
                </Modal.Body>
               </Modal>
              <Modal show={this.state.isShow} 
                onHide={this.hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/Edit Car</Modal.Title>
                </Modal.Header>
                <Modal.Body>                    
                    <div className='col-md-10'>
                        <form  onSubmit={this.handleSubmitForm}>      
                            <div className='form-group'>
                                <label htmlFor='carName'>Car Name</label>
                                <input type='text' defaultValue={this.state.cR_Name} maxLength='30'  onChange={this.onChangeCarName}    className="form-control" name='carName'  placeholder='Ener Car Name' />
                                <div className="text-danger">{this.state.errorCarName}</div>
                            </div>                                     
                            <div className='form-group'>
                            <label htmlFor='discription'>Discription</label>
                            <CKEditor
                                editor={ ClassicEditor }     
                                onChange={this.handleCK} 
                                rows="5"
                                maxLength='200'
                                data={this.state.cR_Discription}                                                        
                            />
                            <div className="text-danger">{this.state.errorDescription}</div>
                            </div>                  
                            <div style={{paddingTop:'10px'}}>
                                <input type="submit" className='btn btn-success' value="Save Changes" />
                                <Button onClick={this.hideModal} style={{marginLeft:'5px'}}>close</Button>                                   
                            </div>                       
                        </form>
                    </div>                 
                </Modal.Body>              
            </Modal>      
            </div>
            <div className='col-md-12'>      
             <div style={{paddingTop:"5px"}}>  
                <Button className="btn btn-primary"  onClick={()=>this.showModal(undefined,null,null)}>Add New Car</Button>        
             </div>        
             <input type="text"  onChange={this.onChangeSearch.bind(this)} style={{float:'right',width:'20%'}}/>
             
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
export default Car;

// import React,{Component} from 'react';
// import {Modal,Button} from 'react-bootstrap';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import "bootstrap/dist/css/bootstrap.min.css";

// class CarList extends Component{
// constructor(props){
//     super(props);    
//     this.state={       
//         cars:[],          
//         cR_Id:0,
//         cR_Name:"",
//         cR_Discription:"", 
//         isShow:false,
//         description:"",
//         carName:'',
//         ckValue :[],           
//     }     
//     this.showModal = this.showModal.bind(this);
//     this.updateModal = this.updateModal.bind(this);
//     this.hideModal = this.hideModal.bind(this);   
//     this.handleSubmitForm = this.handleSubmitForm.bind(this);    
//     this.handleCK=this.handleCK.bind(this);
// }    
// showModal(){    
//     this.setState({isShow:true});
// }
// hideModal(){    
//     this.setState({isShow:false});
// }
// //Ck Editor Event
// handleCK(event,editor){
//     const data = editor.getData();
//     this.setState({ ckValue:data });
// }
// updateModal(){
   

//     /*  let body = {
//          cR_Name: event.target.carName.value, 
//          cR_Discription:this.state.ckValue
//      };
//       const requestOptions = {              
//              method: "PUT",
//              headers: {
//                  "Content-Type": "application/json",
//                  Accept: "application/json",
//                  Authorization :'Bearer '+ localStorage.getItem('token')
//              },
//              body: JSON.stringify(body),
//          };      
//          debugger 
//          let user="c84972c7-9874-4f7d-5ef4-08da130484c5";
//          let baseurl = "https://localhost:44347/api/Car/EditCar/"+user;
//          fetch(baseurl, requestOptions)
//          .then((res) => {
//              if(res.ok)
//              {              
//                alert("ADD SCUCES");
//              }              
//          })
//          .catch((error) => {
//              console.error('error',error);
//          }); */  
// }
// //Fethching Data
// refreshList(){   
//     let tokens=localStorage.getItem('token');
//     fetch('https://localhost:44347/api/Car',{
//     method:'GET',
//     headers:{
//          Authorization :'Bearer '+tokens
//     },
//     })        
//     .then(response=>response.json())
//     .then(data=>{
//         console.log({data});
//         this.setState({cars:data});
//     });
// };
// componentDidMount(){    
//     this.refreshList();
// }     
// handleSubmitForm = (event,editor) => { 
//     event.preventDefault(); 
//     if (event.target.carName.value === "" || event.target.carName.value === undefined) 
//     {
//         alert("Car Name is required");
//     } 
//     else if (this.state.ckValue == "" || this.state.ckValue === undefined ) 
//     {
//         alert("Discription is required");
//     }
//     else
//     {
//         let body = {
//         cR_Name: event.target.carName.value, 
//         cR_Discription:this.state.ckValue
//         };
//         const requestOptions = {              
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//                 Authorization :'Bearer '+ localStorage.getItem('token')
//             },
//             body: JSON.stringify(body),
//         };       
//         let baseurl = "https://localhost:44347/api/Car/AddCar";
//         fetch(baseurl, requestOptions)
//             .then((res) => {
//                 if(res.ok)
//                 {              
//                     alert("Car Added Successfully");   
//                     this.hideModal();  
//                     this.refreshList();   
//                     this.setState({ckValue:[]})                 
//                 }   
//                 else
//                 {
//                     alert("Error Status :"+res.status+"\nFaild Please Try Again");   
//                 } 
//             })        
//             .catch((error) => {
//                 console.error('error',error);
//             });
//         }
//     }
//     render(){
//     const {       
//         cars
//     }=this.state;
//     return(
//      <div className='container'>
//          <div className='row'>
//             <div className='colm-md-12'>
//             <Modal show={this.state.isShow} 
//                 onHide={this.hideModal}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add/Edit Car</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>                    
//                     <div className='col-md-10'>
//                         <form  onSubmit={this.handleSubmitForm}>      
//                             <div className='form-group'>
//                                 <label htmlFor='carName'>Car Name</label>
//                                 <input type='text'  className="form-control" name='carName'  placeholder='Ener Car Name' />
//                             </div>                                     
//                             <div className='form-group'>
//                             <label htmlFor='discription'>Discription</label>
//                             <CKEditor
//                                 editor={ ClassicEditor }     
//                                 onChange={this.handleCK} 
                                       
//                             />
//                             </div>                  
//                             <div style={{paddingTop:'10px'}}>
//                                 <input type="submit" className='btn btn-success' value="Save Changes" />
//                                 <Button onClick={this.hideModal} style={{marginLeft:'5px'}}>close</Button>                                   
//                             </div>                       
//                         </form>
//                     </div>                 
//                 </Modal.Body>              
//             </Modal>      
//             </div>
//              <div className='col-md-12'>        
//              <div style={{paddingTop:"5px"}}>  
//                 <Button className="btn btn-primary"  onClick={this.showModal}>Add New Car</Button>        
//              </div>   
//              <div style={{paddingTop:"5px"}}>  
//                 <Button className="btn btn-primary"  onClick={this.showModal}>Update Car</Button>        
//              </div>   
//             <table className="table table-striped">
//                 <thead>
//                     <tr>                          
//                         <th>      
//                            Car Name
//                         </th>
//                         <th>      
//                            Car Discription
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {cars.map(cr=>
//                     <tr key={cr.cR_Id}>                           
//                         <td>{cr.cR_Name} </td>
//                         <td>{cr.cR_Discription}</td>
//                     </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     </div>
//   </div>
// )}
// }
// export default CarList;