import React, { useState,useEffect } from 'react';

import MaterialTable from 'material-table'
import {Checkbox,Select,MenuItem} from '@material-ui/core'
import {Link} from '@material-ui/core'
import Search from '@material-ui/icons/Search'
import axios from 'axios';
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import { useParams } from 'react-router-dom';
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'






export const TableProfile1 = (props) => {

  const [empList,setEmpList]=useState([]);
  
  
 const [filteredData,setFilteredData]=useState([]);
 const user1 = JSON.parse(localStorage.getItem('user'));
 
 console.log(user1);
  useEffect(() => {
   
    axios.get(`https://db-grads-0mjf-group-11.nw.r.appspot.com/profile/${user1.id}/trades`,{headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(
      res => {
        const temp= [];
          res.data.map((datas) => {
              temp.push(datas);
          });
          setEmpList(temp);
          console.log("result", empList);
          setFilteredData(empList);
          console.log(filteredData);
      } 
  )
  },[]);

 
  
 const [filter, setFilter]=useState(true)
 const [year,setYear]=useState('all')
  const columns = [
    { title: "ID", field: "id"},
    { title: "SecurityID", field: "securityid" },
    {title: "Quantity", field:"quantity"},
    {title: "Price", field:"price"},
    {title: "Settlement Date", field:"settlementdate"},
    {title: "Trade Date", field:"tradedate"},
    
  ]
  //"id":1,"bookid":1,"securityid":1001,"bookname":"book1","userid":102,"quantity":2,"status":"Active",
  //"price":560.7,"buySell":1,"tradedate":"2022-08-07T18:30:00.000+00:00","settlementdate":"2022-08-07T18:30:00.000+00:00"
  const handleChange=()=>{
   setFilter(!filter)
  }
  useEffect(()=>{
setFilteredData(year==='all'?empList:empList.filter(dt=>dt.year===year))

  },[year])

  

  return (
     
      


     <div className="Pets">
      <h2 align="center" style={{marginBottom:'40px'}}>List of Trades </h2>
     
    

     
     <MaterialTable
      icons={{ 
        Check: Check,
            DetailPanel: ChevronRight,
            Export: SaveAlt,
            Filter: FilterList,
            FirstPage: FirstPage,
            LastPage: LastPage,
            NextPage: ChevronRight,
            PreviousPage: ChevronLeft,
            Search: Search,
            ThirdStateCheck: Remove,
      }}
        title=""
        data={empList}
        columns={columns}
        
       />
      
       

      
    </div>

    
      
  );
}

export default TableProfile1;