import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css"
import Pagination from 'react-bootstrap-table2-paginator';
import Filter from 'react-bootstrap-table2-filter';
import BootstarpTable from 'react-bootstrap-table-next';

class Image extends Component {
    fileObj = [];
    fileArray = [];
    search = [];
    state = {
        Items: [],
        columns: [
            {
                dataField: 'img_Id',
                text: 'Image Id',
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
                dataField: 'mO_Name',
                text: 'Model',
                sort: true,
            },
            {
                text: 'Edit',
                formatter: (cell, row) => {
                    return (
                        <div>
                            <button onClick={() => this.showImageModal(row.img_Id,row.mO_Name)} className='btn btn-warning'>Edit</button>
                        </div>
                    );
                }
            },
            {
                text: 'Delete',
                formatter: (cell, row) => {
                    return (
                        <div>
                            <button className='btn btn-danger' onClick={() => this.ShowDeleteModel(row.img_Id)}>Delete</button>
                        </div>
                    );
                }
            }
        ],
        img_Id: 0,
        mO_Name:'',
        img: [],
        image: '',

        isShow: false,
        isShowDeleteModel: false,

        errorImage: "",
        errorCarName: "",
        errorModelName: "",
        valueCarName: "",
        valueModelName: "",
        Car: [],
        Model: [],


    }

    constructor(props) {
        super(props);
        this.getCar();
        this.hideModal();
        this.getImage();
        this.showImageModal = this.showImageModal.bind(this);

        this.ShowDeleteModel = this.ShowDeleteModel.bind(this);

        this.handleSubmitForm = this.handleSubmitForm.bind(this);

        this.onUpload = this.onUpload.bind(this);
        this.deleteModelFalse = this.deleteModelFalse.bind(this);
        this.deleteModelTrue = this.deleteModelTrue.bind(this);
        this.onChangeDropdown = this.onChangeDropdown.bind(this);
        this.onChangeDropdownModel = this.onChangeDropdownModel.bind(this);
    }
    onUpload = (e) => {
   
        this.fileObj.push(e.target.files)
        for (let i = 0; i < this.fileObj[0].length; i++) {
            this.fileArray.push({ file: e.target.files[i] , url: URL.createObjectURL(this.fileObj[0][i])})
        }
        this.setState({ img: this.fileArray })
    }
    showImageModal = (id,name) => {

         if(id === undefined){
          this.setState({isShow:true});
        } 
        else{   
          let tokens=localStorage.getItem('token');
          fetch(`https://localhost:44347/api/Image/GetImageId/${id}`,{
          method:'GET',
          headers:{
               Authorization :'Bearer '+tokens
            },
          })        
          .then(response=>response.json())
          .then(data=>{
              this.setState({img_Id:id})  
              this.setState({mO_Name:name});
               this.setState({isShow:true});
        
          });  
        }
        

    }
    ShowDeleteModel = (id) => {
        if (id !== undefined) {
            this.setState({ isShowDeleteModel: true })
            this.setState({ img_Id: id })
        }
    }
    deleteModelTrue = (event) => {

        const requestOptionsDelete = {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        fetch(`https://localhost:44347/api/Image/RemoveImage/${this.state.img_Id}`, requestOptionsDelete)
            .then(res => {
                if (res.status == 200) {
                    alert("Image Deleted Successfully");
                    this.getImage();
                    this.setState({ isShowDeleteModel: false })
                }
            })
    }
    deleteModelFalse = () => {
        this.setState({ isShowDeleteModel: false })
    }
    hideModal = () => {
        this.setState({ img_Id: 0 });
        this.setState({ img: [] });
        this.setState({ errorCarName: '' });
        this.setState({ errorModelName: '' });
        this.setState({ valueCarName: '' });
        this.setState({ valueModelName: '' });
        this.setState({ errorImage: '' });
        this.setState({ isShow: false });
        this.setState({ ShowDeleteModel: false })
    }
    onChangeDropdown = (e) => {
        this.setState({ valueCarName: e.target.value })
        let tokens = localStorage.getItem('token');
        fetch(`https://localhost:44347/api/Image/GetModel/${e.target.value}`, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + tokens
            },
        })
            .then(function (res) {
                return res.json();
            }).then((json) => {
                this.setState({
                    Model: json
                })
            });
        this.setState({ errorCarName: "" })
    }
    onChangeDropdownModel = (e) => {
        this.setState({ valueModelName: e.target.value })
        this.setState({ errorModelName: "" })
    }
    handleSubmitForm = (event, editor) => {
        event.preventDefault();
        if (this.state.valueCarName === "" || this.state.valueCarName === undefined) {
            this.setState({ errorCarName: "Please Select Car" })
        }
        else if (this.state.valueModelName === "" || this.state.valueModelName === undefined) {
            this.setState({ errorModelName: "Please Select Model" })
        }
        else {
         debugger
            var data = new FormData();
            this.state.img.forEach(element => {
                
                data.append('image', element.file,element.file.name);
            });

            if (this.state.img_Id != "") {
                const requestOptionsPut = {
                    method: "PUT",
                    headers: {                       
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                    body: data,
                };
                const baseurlPut = `https://localhost:44347/api/Image/EditImage/${this.state.img_Id}`;
                fetch(baseurlPut, requestOptionsPut)
                    .then((res) => {
                        if (res.ok) {
                            alert("Update Successfully");
                            this.getImage();
                            this.hideModal();
                        }
                        else {
                            alert("Error Status :" + res.status + "\nFaild Please Try Again");
                        }
                    })
                    .catch((error) => {
                        console.error('error', error);
                    });
            }
            //Add Car
            else {
                debugger

                const requestOptions = {
                    method: "POST",
                    headers:
                    {
                        //'content-type': 'multipart/form-data; boundary=<calculated when request is sent></calculated>',
                        //'Accept': '*/*',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }, 
                    body: data,
                };
                const baseurl = `https://localhost:44347/api/Image/AddImage/${this.state.valueModelName}`;
                fetch(baseurl, requestOptions)
                    .then((res) => {
                        if (res.ok) {
                            alert("Added Successfully");
                            this.setState({ Car: [] })
                            this.setState({ Model: [] })
                            this.hideModal();
                            this.getCar();
                            this.getImage();
                        }
                        else {

                            alert("Error Status :" + res.status + "\nFaild Please Try Again");
                            this.setState({ img: [] })
                        }
                    })
                    .catch((error) => {
                        alert("please select Car");
                        console.error('error', error);
                    });
            }
        }
    }
    getCar = () => {
        let tokens = localStorage.getItem('token');
        fetch('https://localhost:44347/api/Image/GetCarModel', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + tokens
            },
        })
            .then(function (res) {
                return res.json();
            }).then((json) => {
                this.setState({
                    Car: json
                })
            });
    };

    getImage() {
        let tokens = localStorage.getItem('token');
        fetch('https://localhost:44347/api/Image/GetImage', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + tokens
            },
        })
            .then(function (res) {
                return res.json();
            }).then((json) => {
                this.setState({
                   Items: json                                
                })

            });
    };
   onChangeSearch=(event)=>{  
  
        fetch(`https://localhost:44347/api/Image/GetImageFilters?search=${event.target.value}`,{
        method:'GET'})        
       .then(response=>response.json())
       .then(data=>{    
           this.setState({Items:data});
       });   
     }   
    render() {
        const option = {
            page: 0,
            sizePerPageList: [{
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
                        <Modal show={this.state.isShowDeleteModel} onHide={this.deleteModelFalse}>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='col-md-10'>
                                    <div>
                                        <strong><p>Are you sure you want to delete this Model?</p></strong>
                                    </div>
                                    <div style={{ paddingTop: '10px' }}>
                                        <Button onClick={this.deleteModelTrue} style={{ marginLeft: '5px' }}>Yes</Button>
                                        <Button onClick={this.deleteModelFalse} style={{ marginLeft: '5px' }}>No</Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        <Modal show={this.state.isShow} onHide={this.hideModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add/Edit Image</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='col-md-10'>
                                    <form onSubmit={this.handleSubmitForm}>
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
                                            <label htmlFor='carName'>Image</label>
                                            <input type='file' multiple className="form-control" onChange={this.onUpload} placeholder='Select Image' />
                                            <div className="text-danger">{this.state.errorImage}</div>
                                        </div>

                                        <div style={{ paddingTop: '10px' }}>
                                            <input type="submit" className='btn btn-success' value="Save Changes" />
                                            <Button onClick={this.hideModal} style={{ marginLeft: '5px' }}>close</Button>
                                        </div>
                                    </form>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                    <div className='col-md-12'>
                        <div style={{ paddingTop: "5px" }}>
                            <Button className="btn btn-primary" onClick={() => this.showImageModal(undefined,null)}>Add New</Button>
                        </div>
                        <input type="text"  onChange={this.onChangeSearch.bind(this)} style={{ float: 'right', width: '20%' }} />
                        <BootstarpTable bootstrap4
                            columns={this.state.columns}
                            keyField="img_Id"
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
export default Image;