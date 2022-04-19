import React,{Component} from 'react';
import {Modal,Button} from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import Pagination from 'react-bootstrap-table2-paginator';
import Filter from 'react-bootstrap-table2-filter';
import BootstarpTable from 'react-bootstrap-table-next';

class Model extends Component
{    
        search=[];          
        state={         
          Items:[],
          columns:[          
            {
            dataField: 'mO_Id',
            text: 'Model Id',
            hidden: true            
            },
            {
              dataField: 'cR_Name',
              text: 'Car Name',              
            },
            {
              dataField:'mO_Name',
              text:'Model Name',
              sort:true,
            },
            {
              dataField:'mO_Discription',
              text:'Discription',
              sort:true,
            },
            {
              dataField:'mO_Feature',
              text:'Feature',
              sort:true,
            },        
            {
              text:'Edit',
              formatter: (cell,row) => {
                return (
                  <div>
                    <button  onClick={()=>this.showModal(row.mO_Id,row.mO_Name,row.mO_Discription,row.mO_Feature)}  className='btn btn-warning'>Edit</button>      
                  </div>
                );
              }
            },
            { 
              text:'Delete',
              formatter: (cell,row) => {
                return (
                  <div>              
                   <button className='btn btn-danger'  onClick={()=>this.ShowDeleteModel(row.mO_Id)}>Delete</button>
                  </div>                   
                );
              }       
            }
          ],
            mO_Id:0,
            mO_Name:"",
            mO_Discription:"", 
            mO_Feature:"",
            isShow:false,
            isShowDeleteModel:false,
            description:"",
            feature:"",
            errorDescription:"",
            errorFeature:"",
            errorModelName:"",
            errorCarName:'',
            ModelName:'',
            ckValueDiscription :[], 
            ckValueFeature :[], 
            Car:[],
            valueCarName:[]
        }
      
        constructor(props){
          super(props);     
          this.getCar();       
          this.getModelDeatil();
          this.showModal=this.showModal.bind(this);     
          this.hideModal();
          this.deleteModelTrue=this.deleteModelTrue.bind(this); 
          this.deleteModelFalse=this.deleteModelFalse.bind(this); 
          this.ShowDeleteModel=this.ShowDeleteModel.bind(this); 
          this.handleCKDiscription=this.handleCKDiscription.bind(this);
          this.handleCKFeature=this.handleCKFeature.bind(this);
          this.onChangeModelName=this.onChangeModelName.bind(this);
          this.handleSubmitForm=this.handleSubmitForm.bind(this);  
          this.onChangeDropdown=this.onChangeDropdown.bind(this);   
        }
          showModal=(id,modelName,discription,feature)=>{    
            if(id === undefined){
              this.setState({isShow:true});
            } 
            else{  
              debugger
              let tokens=localStorage.getItem('token');
              fetch(`https://localhost:44347/api/Model/GetModelId/${id}`,{
              method:'GET',
              headers:{
                   Authorization :'Bearer '+tokens
                },
              })        
              .then(response=>response.json())
              .then(data=>{
                this.setState({mO_Id:id})  
                  this.setState({mO_Name:modelName});
                  this.setState({mO_Discription:discription});
                  this.setState({mO_Feature:feature});                   
              });  
              
              this.setState({isShow:true});    
            }
          }
              
          ShowDeleteModel=(id)=>{
            if(id !==undefined){
              this.setState({isShowDeleteModel:true})
              this.setState({mO_Id:id})
            }
          }
          deleteModelTrue=(event)=>{
          debugger
            const requestOptionsDelete = {              
              method: "DELETE",
              headers: {
                  Authorization :'Bearer '+ localStorage.getItem('token'),
                  "Content-Type": "application/json",
                  Accept: "application/json",
              },
            };  
          
              fetch(`https://localhost:44347/api/Model/RemoveModel/${this.state.mO_Id}`,requestOptionsDelete)        
              .then(res => {
                if(res.status==200){
                  alert("Model Deleted Successfully");
                  this.getModelDeatil();
                  this.setState({isShowDeleteModel:false})
                }
              })            
          }          
          deleteModelFalse=()=>{
            this.setState({isShowDeleteModel:false})
          }      
          hideModal=()=>{    
            this.setState({mO_Id:''});
            this.setState({mO_Name:''});           
            this.setState({mO_Discription:''});
            this.setState({mO_Feature:''});
            this.setState({errorModelName:''});
            this.setState({errorDescription:''});
            this.setState({errorFeature:''});
            this.setState({isShow:false});
            this.setState({ShowDeleteModel:false});

          }
          onChangeDropdown=(e)=>{
              this.setState({valueCarName:e.target.value})
              this.setState({errorCarName:""})        
          }
          onChangeModelName=(event)=>{
            this.setState({errorModelName:''})
          }
          handleCKDiscription=(event,editor)=>{
              const data = editor.getData();
              this.setState({ ckValueDiscription:data });
              this.setState({errorDescription:''})
          }
          handleCKFeature=(event,editor)=>{
            const data = editor.getData();
            this.setState({ ckValueFeature:data });
            this.setState({errorFeature:''})
         }
          handleSubmitForm = (event,editor) => { 
              event.preventDefault();            
              if(this.state.valueCarName.length===0)
              {
                this.setState({errorCarName:"Please Select Car"})
              }   
              else if (event.target.modelName.value === "" || event.target.modelName.value === undefined) 
              {
                  this.setState({errorModelName:'Model Name is required'})                  
              } 
              else if (this.state.ckValueDiscription == "" || this.state.ckValueDiscription === undefined ) 
              {     
                  this.setState({errorDescription:'Discription is required'})
              }
              else if (this.state.ckValueFeature == "" || this.state.ckValueFeature === undefined ) 
              {     
                  this.setState({errorFeature:'Feature is required'})
              }
              else
              {
                debugger;
                  let body = {    
                    mO_Name: event.target.modelName.value, 
                    mO_Discription:this.state.ckValueDiscription,
                    mO_Feature:this.state.ckValueFeature,
                    cR_Id:this.state.valueCarName,
                  };                     
           
                  if(this.state.mO_Id != ""){
                    const requestOptionsPut = {              
                      method: "PUT",
                      headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                          Authorization :'Bearer '+ localStorage.getItem('token')
                      },
                      body: JSON.stringify(body),
                  };  
                    const baseurlPut = `https://localhost:44347/api/Model/EditModel/${this.state.mO_Id}`;
                    fetch(baseurlPut, requestOptionsPut)
                    .then((res) => {
                        if(res.ok)
                        {              
                            alert("Car Update Successfully");                           
                            this.hideModal();  
                            this.getModelDeatil(); 
                            this.setState({ckValueDiscription:[]})   
                            this.setState({ckValueFeature:[]})                 
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
                    debugger
                    const requestOptions = {              
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                          Authorization :'Bearer '+ localStorage.getItem('token')
                      },
                      body: JSON.stringify(body),
                  };  
                  const baseurl = "https://localhost:44347/api/Model/AddModel";
                  fetch(baseurl, requestOptions)
                      .then((res) => {
                          if(res.ok)
                          {              
                              alert("Model Added Successfully");   
                              this.hideModal();                             
                              this.getCar();
                              this.getModelDeatil();
                              this.setState({ckValueDiscription:[]})   
                              this.setState({ckValueFeature:[]})                 
                          }   
                          else
                          {
                              this.setState({errorModelName:'Model Name Alredy Exsist'})
                            //  alert("Error Status :"+res.status+"\nFaild Please Try Again");   
                          } 
                      })        
                      .catch((error) => {
                          alert("please select Car");
                          console.error('error',error);
                      });
                 }
              }
          }
          getCar=()=>{   
            let tokens=localStorage.getItem('token');
            fetch('https://localhost:44347/api/Model/GetCarList',{
                method:'GET',
                headers:{
                     Authorization :'Bearer '+tokens
                },
            }) 
            .then(function(res) {
                return res.json();
            }).then((json)=> {
                this.setState({
                   Car: json
                })
            });   
        };
        getModelDeatil() {
          let tokens=localStorage.getItem('token');
          fetch('https://localhost:44347/api/Model/GetModelDetail',{
              method:'GET',
              headers:{
                   Authorization :'Bearer '+tokens
              },
          }) 
          .then(function(res) {
              return res.json();
          }).then((json)=> {
              this.setState({                
                 Items: json                                
              })
          });   
      };
      onChangeSearch=(event)=>{    
             let tokens=localStorage.getItem('token');
             fetch(`https://localhost:44347/api/Model/GetModelFilters?search=${event.target.value}`,{
             method:'GET', 
             headers:{
              Authorization :'Bearer '+tokens
              },
            })        
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
            },{  
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
              <Modal show={this.state.isShow} 
                      onHide={this.hideModal}>
                      <Modal.Header closeButton>
                          <Modal.Title>Add/Edit Model</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>                    
                          <div className='col-md-10'>
                              <form  onSubmit={this.handleSubmitForm}>   
                                  <div className='Dropdown.Toggle'>
                                  <label htmlFor='caName'>Car Name</label>
                               
                                     <select className='form-control' value={this.state.valueCarName} onChange={this.onChangeDropdown}>
                                     <option value="">Select Items </option>
                                    {
                                       
                                        this.state.Car.map((obj) => {
                                        return <option value={obj.cR_Id}>{obj.cR_Name}</option>
                                        })
                                    }</select>
                                    <div className="text-danger">{this.state.errorCarName}</div>
                                  </div>   
                                  <div className='form-group'>
                                      <label htmlFor='carName'>Model Name</label>
                                      <input type='text' defaultValue={this.state.mO_Name} name='modelName' maxLength='30'  onChange={this.onChangeModelName}    className="form-control"   placeholder='Ener Model Name' />
                                      <div className="text-danger">{this.state.errorModelName}</div>
                                  </div>                                     
                                  <div className='form-group'>
                                  <label htmlFor='discription'>Discription</label>
                                  <CKEditor
                                      editor={ ClassicEditor }     
                                      onChange={this.handleCKDiscription}  
                                      data={this.state.mO_Discription}
                                      maxLength='200'
                                                                                       
                                  />
                                  <div className="text-danger">{this.state.errorDescription}</div>
                                  </div>        
                                  <div className='form-group'>
                                    <label htmlFor='feature'>Feature</label>
                                    <CKEditor
                                        editor={ ClassicEditor }     
                                        onChange={this.handleCKFeature}     
                                        data={this.state.mO_Feature}                                                                     
                                    />
                                    <div className="text-danger">{this.state.errorFeature}</div>
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
                      <Button className="btn btn-primary"  onClick={()=>this.showModal(undefined,null,null,null)}>Add New Model</Button>        
                   </div>        
                   <input type="text"  onChange={this.onChangeSearch.bind(this)} style={{float:'right',width:'20%'}}/>
                    <BootstarpTable bootstrap4
                    columns={this.state.columns} 
                    keyField="mO_Id"
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
export default Model;