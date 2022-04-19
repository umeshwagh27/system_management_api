import * as React from 'react';
import { Grid, GridColumn  } from '@progress/kendo-react-grid';
import '@progress/kendo-theme-default/dist/all.css';

class Models extends React.Component {
  state = {
    Car :[], 
    skip: 0,
    take:10 
  };
  constructor(props){
    super(props);     
    this.getList();    
    this.pageChange=this.pageChange.bind(this);  
  
  }
  onChangeSearch=(event)=>{    

    fetch(`https://localhost:44347/api/Car/GetCarDetail?search=${event.target.value}`,{
    method:'GET'})        
   .then(response=>response.json())
   .then(data=>{
     this.setState({Car:data});
   });

}
  pageChange = (event) => { 

    this.setState({skip:event.page.skip})
    this.setState({take:event.page.take})
      fetch('https://localhost:44347/api/Car/GetCarDetail?page=20&page_size=30',{
      method:'GET'})        
      .then(response=>response.json())
      .then(data=>{                  
          this.setState({Car:data}); 
      });    
  };
  getList=()=>{   
    debugger
      fetch(`https://localhost:44347/api/Car/GetCarDetail?&page=${this.state.skip}&page_size=${this.state.take}`,{
      method:'GET'
    })
    .then((response) => response.json())
    .then(data=>
     
      this.setState({Car:data})
      )
};
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
          <div style={{paddingTop:"5px"}}>  
                <button className="btn btn-primary" >Add New Car</button>        
            </div>   
            <div> <input type="text"  onChange={this.onChangeSearch.bind(this)} style={{float:'right',width:'20%'}}/></div>     
            </div>
      <div className='col-md-12'>
        <Grid
          style={{
            height: "400px",
          }}
          data={this.state.Car.slice(
            this.state.skip,
            this.state.take + this.state.skip
          )}
          skip={this.state.skip}
          take={this.state.take}
          total={this.state.Car.length}
          pageable={true}
          onPageChange={this.pageChange}
        >
          <GridColumn field="cR_Id" />
          <GridColumn field="cR_Name" title="cR_Name" />
          <GridColumn field="cR_Discription" title="cR_Name" />
        </Grid>
      </div> 
      </div>
  </div>
    );
  }
}

export default Models;


