'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';

import { DataGrid, GridDeleteIcon, ptBR } from '@mui/x-data-grid';
import {useMCCService } from '@/hooks/useMCCService';
import colors from '@/styles/Theme/colors';
import { useAuthContext } from '@/contexts/Auth';
import { useSnackbarContext } from '@/contexts/Snackbar';


export default function ListagemGeral() {
  const { getAllCompleteFamilia,
          getAllCompleteFrota,
          getAllCompleteModelo,
          getAllManyBU        
        } = useMCCService();
  const { dispatchSnackbar } = useSnackbarContext();
  const { user } = useAuthContext();
  const { isAdmin } = user ?? {};
  const { primary } = colors.brand;
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [rowsToRender, setRowsToRender] = useState([])

  const TABS = [
    {
      id:'bu',
      enabled: true,
      label: 'BU',
      searchText: 'Buscar por BU',
      columns: [
        {field: 'nome', headerName: 'Nome', flex: 1, },
      ] 
    },
    {
      id:'familia',
      enabled: true,
      label: 'Família',
      searchText: 'Buscar por família',
      columns:
      [
        {field: 'nome', headerName: 'Familia', flex: 1  },
        {field: 'bu.nome', headerName: 'BU', flex: 1, valueGetter: (params) => params.row.bu.nome },
      ]
    },
    {
      id:'modelo',
      enabled: true,
      label: 'Modelo',
      searchText: 'Buscar por modelo',
      columns: [
        {field: 'nome', headerName: 'Nome', flex: 1, },
        {field: 'descricao', headerName: 'Descrição', flex: 1  },
        {field: 'titulo', headerName: 'Titulo', flex: 1},
        {field: 'familia.nome', headerName: 'Familia', flex: 1, valueGetter: (params) => params.row.familia.nome },
        {field: 'status', headerName: 'Status', flex: 1, renderCell: (params)=>params.value ? 'ativo' : 'inativo'   },
      ]
    },
    {
      id:'frota',
      enabled: true,
      label: 'Frota',
      searchText: 'Buscar número de frota',
      columns: [
        {field: 'numeroFrota', headerName: 'Número de frota', flex: 1, },
        {field: 'modelo.nome', headerName: 'Modelo',  flex: 1, valueGetter: (params) => params.row.modelo.nome  },
        {field: 'status', headerName: 'Status', flex: 1 , renderCell: (params)=>params.value ? 'ativo' : 'inativo'  },
        {field: 'isRental', headerName: 'Rental', flex: 1, renderCell: (params)=>params.value ? 'ativo' : 'inativo'   },
      ] 
    },  
  ]
 
  const [tabId, setTabId] = useState('bu');
  const [tab, setTab] = useState(TABS[0]);


  useEffect(()=>{
    getAllManyBU().then(
      response =>{
        let myList = response.data
        setRows(myList)
        setIsLoading(false)
      }
    )
  }, [])

  useEffect(()=>{
    handleFilter(searchQuery)
  },[rows])

  const handleFilter = (value) =>{
    setSearchQuery(value)
    let myList = rows.filter((item)=> {
      const valor = tabId === 'frota' ? item.numeroFrota : item.nome
      return valor.toLowerCase().startsWith(value.toLowerCase())
    })

    setRowsToRender(value === '' ? rows : myList)
  }

  const handleChangeTab = async(event, newTabId) => {
    setTabId(newTabId);
    setIsLoading(true)
    setTab(()=>TABS.find((tab)=> tab.id === newTabId))

    await handlePageChange(newTabId)
  };

  const handlePageChange = async(newTabId) =>{

    const handleGetResponse = (response) =>{
      const responseList = response.data
      setRows(responseList)
      setIsLoading(false)
    }


    switch(newTabId ? newTabId : tabId){
      case 'frota':
        getAllCompleteFrota().then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'modelo':
        getAllCompleteModelo().then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'familia':
        getAllCompleteFamilia().then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'bu':
        getAllManyBU().then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      default: return ''
    }
  }


  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop={'50px'}
      alignItems="center"
      minHeight="100vh"
    > 
      <Paper elevation={3} sx={{ padding: 4, width: '90%' }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Listagens
        </Typography>

        <TextField
          label={tab.searchText}
          variant="outlined"
          value={searchQuery}
          onChange={e=>handleFilter(e.target.value)}
          sx={{ marginBottom: 2, width: '25%' }}
        />

        <Box sx={{ height: '90%', width: '100%', marginTop: 4 }}>
          <Tabs
            value={tabId}
            onChange={handleChangeTab}
            TabIndicatorProps={{
              title: 'Clique para selecionar',
              style: { background: `#fcdac5` },
            }}
            sx={{
              '& button, button:hover, button:focus': {
                color: primary,
                fontSize: '16px',
                borderBottom: '2px solid #ddd',
              },
              '& button:hover, button:focus': {
                background: '#f6f6f6',
              },
              '& button.Mui-selected': {
                background: primary,
                color: '#fff',
                fontWeight: 'bold',
              },
            }}
            variant="fullWidth"
          >
            {TABS.map((tab) => {
              return <Tab key={tab.label} value={tab.id} label={tab.label} disabled={!tab.enabled} />;
            })}
          </Tabs>
          {isLoading ?
            <div className="flex items-center justify-center flex-grow h-[300px]">
              <CircularProgress sx={{ color: '#F37021' }} />
            </div>
          :
            <DataGrid
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              rows={rowsToRender}
              columns={tab.columns}
              getRowId={(row) => row.id}
            />
          }
        </Box>
      </Paper>
    </Box>
  );
}
