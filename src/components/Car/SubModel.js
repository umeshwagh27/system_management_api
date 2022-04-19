import React,{Component} from 'react';
import {Modal,Button} from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import Pagination from 'react-bootstrap-table2-paginator';
import Filter from 'react-bootstrap-table2-filter';
import BootstarpTable from 'react-bootstrap-table-next';

class SubModel extends Component
{ 
    search=[];          
    state={         
      Items:[],
      columns:[          
        {
        dataField: 'sM_Id',
        text: 'SM Id',
        hidden: true            
        },     
        {
          dataField:'sM_Name',
          text:'SM Name',
          sort:true,
        },
        {
          dataField:'sM_Discription',
          text:'Discription',
          sort:true,
        },
        {
          dataField:'sM_Feature',
          text:'Feature',
          sort:true,
        },      
        {
            dataField:'sM_Price',
            text:'Price',
            sort:true,
        },    
        {
            dataField:'mO_Name',
            text:'Model',
            sort:true,
        }, 
        {
          text:'Edit',
          formatter: (cell,row) => {
            return (
              <div>
                <button  onClick={()=>this.showSMModal(row.sM_Id,row.sM_Name,row.sM_Discription,row.sM_Feature,row.sM_Price)}  className='btn btn-warning'>Edit</button>      
              </div>
            );
          }
        },
        { 
          text:'Delete',
          formatter: (cell,row) => {
            return (
              <div>              
               <button className='btn btn-danger'  onClick={()=>this.ShowDeleteModel(row.sM_Id)}>Delete</button>
              </div>                   
            );
          }       
        }
      ],
        sM_Id:0,
        sM_Name:"",
        sM_Discription:"", 
        sM_Feature:"",
        sM_Price:"",
        isShow:false,
        isShowDeleteModel:false,
       
        errorSubModelName:"",
        errorDescription:"",          
        errorFeature:"",
        errorSubModelPrice:"",
        errorModelName:"",
        errorCarName:"",
    
        ckValueDiscription :[], 
        ckValueFeature :[], 
        Car:[],
        Model:[],
        valueCarName:"",
        valueModelName:"",
    }
  
    constructor(props){
      super(props);     
      this.getCar();         
      this.hideModal();
      this.getModelDeatil();
      this.showSMModal=this.showSMModal.bind(this);   
      this.deleteModelTrue=this.deleteModelTrue.bind(this); 
      this.ShowDeleteModel=this.ShowDeleteModel.bind(this);  
      this.handleCKFeature=this.handleCKFeature.bind(this);
      this.handleSubmitForm=this.handleSubmitForm.bind(this);  
      this.onChangeDropdown=this.onChangeDropdown.bind(this);   
      this.deleteModelFalse=this.deleteModelFalse.bind(this); 
      this.onChangeModelName=this.onChangeModelName.bind(this);
      this.handleCKDiscription=this.handleCKDiscription.bind(this);
      this.onChangeDropdownModel=this.onChangeDropdownModel.bind(this);
      this.onChangeTable=this.onChangeTable.bind(this);
    }
    onChangeTable=(sort,size,limit)=>{

    }
    
      showSMModal=(id,name,discription,feature,price)=>{    
   
         if(id === undefined){
          this.setState({isShow:true});
        } 
        else{   
          debugger;
          let tokens=localStorage.getItem('token');
          fetch(`https://localhost:44347/api/SubModel/GetSMId/${id}`,{
          method:'GET',
          headers:{
               Authorization :'Bearer '+tokens
            },
          })        
          .then(response=>response.json())
          .then(data=>{
              this.setState({sM_Id:id})  
              this.setState({sM_Name:name});
              this.setState({sM_Discription:discription});
              this.setState({sM_Feature:feature});
              this.setState({sM_Price:price});     
          });  
         
          this.setState({isShow:true});    
        }  
      }
      ShowDeleteModel=(id)=>{
        if(id !==undefined){
          this.setState({isShowDeleteModel:true})
          this.setState({sM_Id:id})
        }
      }
      deleteModelTrue=(event)=>{
        const requestOptionsDelete = {              
          method: "DELETE",
          headers: {
              Authorization :'Bearer '+ localStorage.getItem('token'),
              "Content-Type": "application/json",
              Accept: "application/json",
          },
        };  
          fetch(`https://localhost:44347/api/SubModel/RemoveSubModel/${this.state.sM_Id}`,requestOptionsDelete)        
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
        this.setState({sM_Id:''});
        this.setState({sM_Name:''});           
        this.setState({sM_Discription:''});
        this.setState({sM_Feature:''});
        this.setState({sM_Price:''});
        this.setState({errorSubModelName:''});
        this.setState({errorDescription:''});
        this.setState({errorFeature:''});
        this.setState({isShow:false});
        this.setState({ShowDeleteModel:false})
      }
      onChangeDropdown=(e)=>{
          this.setState({valueCarName:e.target.value})         
            let tokens=localStorage.getItem('token');
            fetch(`https://localhost:44347/api/SubModel/GetModel/${e.target.value}`,{
                method:'GET',
                headers:{
                     Authorization :'Bearer '+tokens
                },
            }) 
            .then(function(res) {
                return res.json();
            }).then((json)=> {
                this.setState({
                   Model: json
                })
            });             
          this.setState({errorCarName:""})                 
      }
      onChangeDropdownModel=(e)=>{
        this.setState({valueModelName:e.target.value})
        this.setState({errorModelName:""})   
      }
      onChangeModelName=(e)=>{
        this.setState({errorSubModelName:''})
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
          debugger
          if(this.state.valueCarName ==="" || this.state.valueCarName===undefined)
          {
            this.setState({errorCarName:"Please Select Car"})
          }   
          else if(this.state.valueModelName ==="" || this.state.valueModelName===undefined)
          {
            this.setState({errorModelName:"Please Select Model"})
          }  
          else if (event.target.submodelName.value === "" || event.target.submodelName.value === undefined) 
          {
              this.setState({errorSubModelName:'Name is required'})                  
          } 
          else if (this.state.ckValueDiscription == "" || this.state.ckValueDiscription === undefined ) 
          {     
              this.setState({errorDescription:'Discription is required'})
          }
          else if (this.state.ckValueFeature == "" || this.state.ckValueFeature === undefined ) 
          {     
              this.setState({errorFeature:'Feature is required'})
          }
          else if (event.target.price.value === "" || event.target.price.value === undefined ) 
          {     
              this.setState({errorSubModelPrice:'Enter Amount Grater Then 0'})
          }
          else
          {
              let body = {
              sM_Name: event.target.submodelName.value,              
              sM_Discription:this.state.ckValueDiscription,
              sM_Feature:this.state.ckValueFeature,
              sM_Price:event.target.price.value,
              mO_Id: this.state.valueModelName,
              };                     
       
              if(this.state.sM_Id != ""){
                const requestOptionsPut = {              
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization :'Bearer '+ localStorage.getItem('token')
                  },
                  body: JSON.stringify(body),
              };  
                const baseurlPut = `https://localhost:44347/api/SubModel/EditSubModel/${this.state.sM_Id}`;
                fetch(baseurlPut, requestOptionsPut)
                .then((res) => {
                    if(res.ok)
                    {              
                        alert("Update Successfully");  
                        this.getModelDeatil(); 
                        this.hideModal();  
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
              const baseurl = "https://localhost:44347/api/SubModel/AddSubModel";
                fetch(baseurl, requestOptions)
                    .then((res) => {
                        if(res.ok)
                        {              
                            alert("Added Successfully");
                            this.setState({ckValueDiscription:[]})   
                            this.setState({ckValueFeature:[]})    
                            this.setState({Car:[]}) 
                            this.setState({Model:[]})     
                            this.hideModal();                            
                            this.getCar();  
                            this.getModelDeatil();    
                        }   
                        else
                        {
                            this.setState({errorSubModelName:'Sub Model Name Alredy Exsist'})
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
        fetch('https://localhost:44347/api/SubModel/GetCarModel',{
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
    onChangeSubModelPrice=(e)=>{
      this.setState({errorSubModelPrice:''});
    }
    getModelDeatil() {
         
      let tokens=localStorage.getItem('token');
      fetch('https://localhost:44347/api/SubModel/GetProcedure?page_size=3&page_limit=2',{
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
          console.log(json);
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
    render()
    {
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
                    <Modal show={this.state.isShow}  onHide={this.hideModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add/Edit SubModel</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>                    
                            <div className='col-md-10'>
                                <form  onSubmit={this.handleSubmitForm}>   
                                    <div className='form-group'>
                                        <label htmlFor='carName'>Car Name</label>                       
                                            <select className='form-control' value={this.state.valueCarName} onChange={this.onChangeDropdown}>
                                                <option value="">Select Items </option>
                                                {                             
                                                    this.state.Car.map((obj) => {
                                                    return <option value={obj.cR_Id}>{obj.cR_Name}</option>
                                                    })
                                                }
                                            </select>
                                        <div className="text-danger">{this.state.errorCarName}</div>
                                    </div>   
                                    <div className='form-group'>
                                        <label htmlFor='modelName'>Model Name</label>
                                    
                                            <select className='form-control' value={this.state.valueModelName} onChange={this.onChangeDropdownModel}>
                                                <option value="">Select Items </option>
                                                {                               
                                                    this.state.Model.map((obj) => {
                                                    return <option value={obj.mO_Id}>{obj.mO_Name}</option>
                                                    })
                                                }
                                            </select>
                                        <div className="text-danger">{this.state.errorModelName}</div>
                                    </div> 
                                    <div className='form-group'>
                                        <label htmlFor='carName'>Sub Model Name</label>
                                        <input type='text' defaultValue={this.state.sM_Name} maxLength='30' name='submodelName'  onChange={this.onChangeModelName}    className="form-control"   placeholder='Ener Sub Model Name' />
                                        <div className="text-danger">{this.state.errorSubModelName}</div>
                                    </div>                                     
                                    <div className='form-group'>
                                        <label htmlFor='discription'>Discription</label>
                                        <CKEditor
                                            editor={ ClassicEditor }     
                                            onChange={this.handleCKDiscription}  
                                            data={this.state.sM_Discription}
                                            maxLength='200'
                                                                                            
                                        />
                                        <div className="text-danger">{this.state.errorDescription}</div>
                                    </div>        
                                    <div className='form-group'>
                                        <label htmlFor='feature'>Feature</label>
                                        <CKEditor
                                            editor={ ClassicEditor }     
                                            onChange={this.handleCKFeature}     
                                            data={this.state.sM_Feature} 
                                            maxLength='200'                                                                    
                                        />
                                        <div className="text-danger">{this.state.errorFeature}</div>
                                    </div>        
                                    <div className='form-group'>
                                        <label htmlFor='price'>Price</label>
                                        <input type='text' defaultValue={this.state.sM_Price} name='price' maxLength='14' onChange={this.onChangeSubModelPrice}    className="form-control"   placeholder='Ener Price' />
                                        <div className="text-danger">{this.state.errorSubModelPrice}</div>
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
                    <Button className="btn btn-primary"  onClick={()=>this.showSMModal(undefined,null,null,null,null)}>Add New</Button>        
                </div>        
                <input type="text"  onChange={this.onChangeSearch.bind(this)} style={{float:'right',width:'20%'}}/>
                    <BootstarpTable bootstrap4
                    columns={this.state.columns} 
                    keyField="sM_Id"
                    data={this.state.Items}
                    hover
                    striped
                  //  onTableChange={this.onTableHandle()}
                    pagination={Pagination(option)}
                    filter={Filter()}
                />        
                </div>
            </div>       
        </div>
    );
    }
}
export default SubModel;