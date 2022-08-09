

import React, { useState,useEffect } from 'react';
import './Pets.css';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'
import { FormGroup, FormControl, InputLabel, Input, styled} from '@mui/material'
import { ButtonAppBar } from '../header/header'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as moment from 'moment'; 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export const Pets = () => {

  const [empList,setEmpList]=useState([]);

  const [edit, setEdit] = useState(false);
  const [security, setSecurity] = useState(null);
  const [securityDialog, setSecurityDialog] = useState(false);
  const [deleteSecurityDialog, setDeleteSecurityDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
 const [filteredData,setFilteredData]=useState([]);
  useEffect(() => {
    
    axios.get("https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/securities",{headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(
      res => {
        const temp= [];
          res.data.map((datas) => {
            datas.maturitydate = moment(datas.maturitydate).format(moment.HTML5_FMT.DATE);
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
    { title: "ID", field: "id",render:rowData=><Link href={`/trade/${rowData.id}`}>{rowData.id}</Link> },
    { title: "Issuer", field: "issuer" },
    { title: "Maturity Date", field: "maturitydate" },
    { title: "Coupon", field: "coupon" },
    { title: "FaceValue", field: "facevalue" },
    { title: "Status", field: 'status' },
    {title: "Type", field:'type'}
  ]
  const handleChange=()=>{
   setFilter(!filter)
  }
  useEffect(()=>{
setFilteredData(year==='all'?empList:empList.filter(dt=>dt.year===year))

  },[year])

  const handleClose=()=> {
    setSecurityDialog(false);
    setDeleteSecurityDialog(false);
  }
  const Container = styled(FormGroup)`
    width: 30px;
    margin: 5% 0 5% 20%;
    & > div {
        margin-top: 15px;
        
`;

  const addSecurity = (e) => {
    e.preventDefault();
    var securityObj = {
      id : e.target.id.value,
      isin : e.target.isin.value,
      cusip : e.target.cusip.value,
      issuer : e.target.issuer.value,
      maturitydate : e.target.maturitydate.value,
      coupon : e.target.coupon.value,
      type : e.target.type.value,
      facevalue : e.target.facevalue.value,
      status : e.target.status.value,
      assignee : e.target.assignee.value
    }
    setSecurity(securityObj);
    if(edit == true)
    {
      axios.put(`https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/security/${securityObj.id}`, securityObj,{headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then(
        res => {
          if(res.data)
          {
            setSecurityDialog(false);
            setEdit(false);
          }
        }
      )
    }
    else {
      axios.post('https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/security', securityObj,{headers: {
        'Access-Control-Allow-Origin': '*'
      }}).then(
        res => {
          if(res.data)
          {
            setSecurityDialog(false);
            window.location.reload();
          }
        }
      )
    }
  }

  const fetchSecurityData = (id) => {
    axios.get(`https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/security/${id}`,{headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(
      res => {
        var obj = res.data;
        obj.maturitydate = moment(obj.maturitydate).format(moment.HTML5_FMT.DATE); // 2019-11-08
        setSecurity(obj);
        setSecurityDialog(true);
      }
    )
  }

  const deleteSecurity = () => {
    axios.delete(`https://db-grads-0mjf-group-11.nw.r.appspot.com/dashboard/security/${security.id}`,{headers: {
      'Access-Control-Allow-Origin': '*'
    }}).then(
      res => {
        setDeleteSecurityDialog(false);
      })
  }

  return (
    <div className="Pets">
      <ButtonAppBar/>
      <h1 align="center" style={{margin: '20px 0 20px 0'}}>List of Securities</h1>
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
        title="Security"
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
              setSecurity(null);
              setSecurityDialog(true);
            }
          },
          {
            icon: EditIcon,
            tooltip: 'Edit',
            position: 'row',
            disabled: user.role != "Admin",
            onClick: (event, rowData) => {
              setEdit(true);
              fetchSecurityData(rowData.id);
            }
          },
          {
            icon: DeleteIcon,
            tooltip: 'Delete User',
            position: 'row',
            disabled: user.role != "Admin",
            onClick: (event, rowData) => {
              setSecurity(rowData);
              setDeleteSecurityDialog(true);
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
          <form onSubmit={addSecurity}>
            <FormControl>
                <InputLabel htmlFor="my-input">ID</InputLabel>
                <Input name='id' id="my-input" required value={security ? security.id : ''}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">ISIN</InputLabel>
                <Input name='isin' id="my-input" required defaultValue={security ? security.isin : null}/> 
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">CUSIP</InputLabel>
                <Input name='cusip' id="my-input" required defaultValue={security ? security.cusip: ''}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Issuer</InputLabel>
                <Input name='issuer' id="my-input" required defaultValue={security ? security.issuer: ''} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Maturity Date</InputLabel>
                <Input name='maturitydate' id="my-input" type='date' required defaultValue={security ? security.maturitydate : null}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Coupon</InputLabel>
                <Input name='coupon' id="my-input" required defaultValue={security ? security.coupon : null}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Type</InputLabel>
                <Input name='type' id="my-input" required defaultValue={security ? security.type : null} />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Face Value</InputLabel>
                <Input name='facevalue' id="my-input" required defaultValue={security ? security.facevalue : null}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Status</InputLabel>
                <Input name='status' id="my-input" required defaultValue={security ? security.status : null}/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Assignee</InputLabel>
                <Input name='assignee' id="my-input" required defaultValue={security ? security.assignee : null}/>
            </FormControl>
            {/* <FormControl>
                <Button variant="contained" color="primary" style={{backgroundColor: 'black',color:'white',
                  fontSize: '20px', padding: '10px 60px', borderRadius:'5px', margin:'10px 0px'}} onClick={addSecurity}>Submit</Button>
            </FormControl> */}
            <FormControl>
              <input type="submit"></input>
            </FormControl>
            </form>
            </Container>
        </Box>
      </Modal>

      <Modal open={deleteSecurityDialog} onClose={handleClose} sx={style}>
        <div className="confirmation-content" style={{backgroundColor:'none'}}>
          <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem'}} />
            {security && <span>Are you sure you want to delete <b>{security.id}</b>?</span>}
            <FormControl>
                <Button variant="contained" color="primary" style={{backgroundColor: '#ddeff4',color:'red',
                  fontSize: '20px', padding: '10px 60px', borderRadius:'5px', margin:'60px 0px'}} onClick={deleteSecurity}>DELETE</Button>
            </FormControl>
        </div>
      </Modal>
    </div>
  );
}

export default Pets;

