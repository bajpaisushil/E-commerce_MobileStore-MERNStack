import React, { useEffect } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { productsDelete } from '../../../features/productsSlice';
import EditProduct from '../EditProduct';
import { userDelete, usersFetch } from '../../../features/usersSlice';


function UsersList() {
  const dispatch=useDispatch();
  const {list}=useSelector((state)=> state.users);
  const nav=useNavigate();

  useEffect(()=>{
    dispatch(usersFetch());
  }, [dispatch]);

  const rows=list && list.map(user=> {
    return {
      id: user._id,
      uName: user.name,
      uEmail: user.email,
      isAdmin: user.isAdmin,
    }
  })
  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'uName', headerName: 'Name', width: 150},
    {field: 'uEmail', headerName: 'Email', width: 200},
    {
        field: 'isAdmin',
        headerName: 'role',
        width: 100,
        renderCell: (params)=>{
            return(
              <div>
                {params.row.isAdmin? (
                    <Admin>Admin</Admin>
                ): (
                    <Customer>Customer</Customer>
                )}
              </div>
            )
          }
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params)=>{
        return(
          <Actions>
            <Delete onClick={()=> handleDelete(params.row.id)}>Delete</Delete>
            <View onClick={()=> nav(`/user/${params.row.id}`)}>View</View>
          </Actions>
        )
      }
    }
  ];
  const handleDelete=(id)=>{
    dispatch(userDelete(id));
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}

export default UsersList;


const Actions=styled.div`
width: 100%;
display: flex;
justify-content: space-between;
button{
  border: none;
  outline: none;
  padding: 3px 5px;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}
`
const Delete=styled.button`
background-color: rgb(255, 77, 73);
`
const View=styled.button`
background-color: rgb(114, 225, 40);
`
const Admin=styled.div`
color: rgb(253, 181, 40);
background: url(253, 181, 40, 0.12);
padding: 3px 5px;
border-radius: 3px;
font-size: 14px;
`
const Customer=styled.div`
color: rgb(38, 198, 249);
background-color: rgb(28, 198, 249, 0.12);
padding: 3px 5px;
border-radius: 3px;
font-size: 14px;
`

