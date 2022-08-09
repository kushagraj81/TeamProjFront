import React, { useState,useEffect } from 'react';
import './trade.css';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { ButtonAppBar } from '../header/header';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as moment from 'moment';

import { FormGroup, FormControl, InputLabel, Input, styled} from '@mui/material'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const Trade = (props) => {

  const [empList,setEmpList]=useState([]);
  const [edit, setEdit] = useState(null);
  const [trade, setTrade] = useState(null);
  const [securityDialog, setTradeDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
 const [filteredData,setFilteredData]=useState([]);
 const { id } = useParams();
  useEffect(() => {
   
    axios.get(`https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/${id}/trades`,{headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(
      res => {
        const temp= [];
          res.data.map((datas) => {
              datas.settlementdate = moment(datas.settlementdate).format(moment.HTML5_FMT.DATE);
              datas.tradedate = moment(datas.tradedate).format(moment.HTML5_FMT.DATE);
              temp.push(datas);
          });
          setEmpList(temp);
          setFilteredData(empList);
      } 
  )
  },[]);

 
  
 const [filter, setFilter]=useState(true)
 const [year,setYear]=useState('all')
  const columns = [
    { title: "ID", field: "id"},
    { title: "SecurityID", field: "securityid" },
    { title: "Book Name", field: "book.bookname" },
    
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

  const handleClose=()=> {
    setTradeDialog(false);
  }
  const Container = styled(FormGroup)`
    width: 50%;
    margin: 5% 0 0 25%;
    & > div {
        margin-top: 25px;
`;

  const addTrade = (e) => {
    e.preventDefault();
    var tradeObj = {
      id : e.target.id.value,
      bookid : e.target.bookid.value,
      securityid : e.target.securityid.value,
      quantity : e.target.quantity.value,
      status : e.target.status.value,
      price : e.target.price.value,
      buySell : e.target.bs.value,
      tradedate : e.target.tradedate.value,
      settlementdate : e.target.settlementdate.value
    }
    setTrade(tradeObj);
    if(edit==true)
    {
      axios.put(`https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/trade/${tradeObj.id}`, tradeObj,{headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then(
        res => {
          if(res.data)
          {
            setTradeDialog(false);
            setEdit(false);
            window.location.reload();
          }
        }
      )
    }
    else {
      axios.post('https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/trade', trade,{headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then(
        res => {
          if(res.data)
          {
            setTradeDialog(false);
            window.location.reload();
          }
        }
      )
    }
  }

  const fetchTradeData = (id) => {
    axios.get(`https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/trade/${id}`,{headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(
      res => {
        var obj = res.data;
        obj.tradedate = moment(obj.tradedate).format(moment.HTML5_FMT.DATE); // 2019-11-08
        obj.settlementdate = moment(obj.settlementdate).format(moment.HTML5_FMT.DATE); // 2019-11-08
        setTrade(obj);
        setTradeDialog(true);
      }
    )
  }

  return (
     
      


     <div className="Pets">
        <ButtonAppBar/>
      <h1 align="center">List of Trades of Bond : {id}</h1>
     
    

     
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
        title="Trades"
        data={empList}
        columns={columns}
        options={{
          filtering:filter,
          actionsColumnIndex: -1
        }}
        actions={[
          {
            icon:()=><Checkbox
            checked={filter}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />,
          tooltip:"Hide/Show Filter option",
          isFreeAction:true
          },
          {
            icon: AddIcon,
            tooltip: "Add",
            position: "toolbar",
            disabled: user.role != "Admin",
            onClick: () => {
              setTrade(null);
              setTradeDialog(true);
            }
          },
          {
            icon: EditIcon,
            tooltip: 'Edit',
            position: 'row',
            disabled: user.role != "Admin",
            onClick: (event, rowData) => {
              setEdit(true);
              fetchTradeData(rowData.id);
            }
          }          
        ]}
       />
      
      <Modal
        open={securityDialog}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >

        <Box sx={style} style={{width:'40%'}}>
          <Container>
        <Typography variant="h5">Security Details</Typography>
          <form onSubmit={addTrade}>  
            <FormControl>
                <InputLabel htmlFor="my-input">ID</InputLabel>
                <Input name='id' id="my-input" required value={trade ? trade.id : null} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">BookID</InputLabel>
                <Input name='bookid' id="my-input" required defaultValue={trade ? trade.bookid : null} /> 
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">SecurityID</InputLabel>
                <Input name='securityid' id="my-input" required defaultValue={trade ? trade.securityid : null}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Quantity</InputLabel>
                <Input name='quantity' id="my-input" required defaultValue={trade ? trade.quantity : null} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Status</InputLabel>
                <Input name='status' id="my-input" required defaultValue={trade ? trade.status : null} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Price</InputLabel>
                <Input name='price' id="my-input" required defaultValue={trade ? trade.price : null} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Buy_Sell</InputLabel>
                <Input name='bs' id="my-input" required defaultValue={trade ? trade.buySell : null} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Trade Date</InputLabel>
                <Input name='tradedate' id="my-input" type='date' required defaultValue={trade ? trade.tradedate : null}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Settlement Date</InputLabel>
                <Input name='settlementdate' id="my-input" type='date' required defaultValue={trade ? trade.settlementdate : null}/>
            </FormControl>
           
            {/* <FormControl>
                <Button variant="contained" color="primary" style={{backgroundColor: 'black',color:'white',
                  fontSize: '20px', padding: '10px 60px', borderRadius:'5px', margin:'10px 0px'}}>Submit</Button>
            </FormControl> */}
            <FormControl>
              <input type="submit"></input>
            </FormControl>
          </form>
            </Container>
        </Box>
      </Modal>     
    </div>

    
      
  );
}

export default Trade;