'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { Button } from '@/components/@shared/Button';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridDeleteIcon, ptBR } from '@mui/x-data-grid';
import colors from '@/styles/Theme/colors';
import { EditNote } from '@mui/icons-material';
import { DefaultModal } from '@/components/@shared/DefaultModal';
import { Input } from '@/components/@shared/Input';
import { Text5, Text6 } from '@/components/@shared/Texts';
import { ActionButtons } from '@/components/ActionButtons';
import { CustomForm } from '@/components/@shared/CustomForm';
import { z } from 'zod';


export default function Listagens() {
  const { primary } = colors.brand;
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [renderType, setRenderType] = useState('')
  const [targetRow, setTargetRow] = useState({})
  const [co2Rows, setco2Rows] = useState([
    {id: 1, nome: 'co1', descricao: 'co1', id_produto: 'minha resposta', marca: 'co1', altura: 1.9 , comprimento: 1, largura: 1, peso: 1, fator_1_producao: 1, fator_2_frente: 1, fator_3_operacao: 1, fator_4_manutencao: 1, fator_5_descarte: 1, massa: 1},
    {id: 2, nome: 'co2', descricao: 'co2', id_produto: 'minha resposta', marca: 'co1', altura: 2.9 , comprimento: 2, largura: 2, peso: 2, fator_1_producao: 2, fator_2_frente: 2, fator_3_operacao: 2, fator_4_manutencao: 2, fator_5_descarte: 2, massa: 2},
    {id: 3, nome: 'co3', descricao: 'co3', id_produto: 'minha resposta', marca: 'co1', altura: 3.9 , comprimento: 3, largura: 3, peso: 3, fator_1_producao: 3, fator_2_frente: 3, fator_3_operacao: 3, fator_4_manutencao: 3, fator_5_descarte: 3, massa: 3},
  ])
  const [seoRows, setSeoRows] = useState([
    {id: 1, descricao_meta: 'Decrição1', metapalavras_chave: 'palavra chave1', titulo: 'titulo1', slug: 'slug1' },
    {id: 2, descricao_meta: 'Decrição2', metapalavras_chave: 'palavra chave2', titulo: 'titulo2', slug: 'slug2' },
    {id: 3, descricao_meta: 'Decrição3', metapalavras_chave: 'palavra chave3', titulo: 'titulo3', slug: 'slug3' },
  ])
  const [rows, setRows] = useState(co2Rows)
  const TABS = [
    {
      id:'co2',
      enabled: true,
      label: 'CO2',
      searchText: 'Buscar por ID de CO2',
      columns: [
        {field: 'nome', headerName: 'Nome', editable: editingEnabled, flex: 1, },
        {field: 'descricao', headerName: 'Descrição', editable: editingEnabled, flex: 1  },
        {field: 'id_produto', headerName: 'Id do Produto', editable: editingEnabled, flex: 1  },
        {field: 'marca', headerName: 'Marca', editable: editingEnabled, flex: 1  },
        {field: 'altura', headerName: 'Altura', editable: editingEnabled, flex: 1  },
        {field: 'comprimento', headerName: 'Comprimento', editable: editingEnabled, flex: 1  },
        {field: 'largura', headerName: 'Largura', editable: editingEnabled, flex: 1  },
        {field: 'peso', headerName: 'Peso', editable: editingEnabled, flex: 1  },
        {field: 'fator_1_producao', headerName: 'F1 Produção', editable: editingEnabled, flex: 1  },
        {field: 'fator_2_frente', headerName: 'F2 Frente', editable: editingEnabled, flex: 1  },
        {field: 'fator_3_operacao', headerName: 'F3 Operação', editable: editingEnabled, flex: 1  },
        {field: 'fator_4_manutencao', headerName: 'F4 Manutenção', editable: editingEnabled, flex: 1  },
        {field: 'fator_5_descarte', headerName: 'F5 Descarte', editable: editingEnabled, flex: 1  },
        {field: 'massa', headerName: 'Massa', editable: editingEnabled, flex: 1  },
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row)}>
                <EditNote />
              </IconButton>
              <IconButton onClick={() => handleShowModal('delete', params.row)}>
                <GridDeleteIcon />
              </IconButton>
            </div>
            
          ),
        },
      ] 
    },
    {
      id:'seo',
      enabled: true,
      label: 'SEO',
      searchText: 'Buscar por ID de SEO',
      columns: [
        {field: 'descricao_meta', headerName: 'Descrição Meta', editable: editingEnabled, flex: 1, },
        {field: 'metapalavras_chave', headerName: 'Metapalavras-Chave', editable: editingEnabled, flex: 1  },
        {field: 'titulo', headerName: 'Tag de Titulo', editable: editingEnabled, flex: 1  },
        {field: 'slug', headerName: 'Slug do URL', editable: editingEnabled, flex: 1  },
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row)}>
                <EditNote />
              </IconButton>
              <IconButton onClick={() => handleShowModal('delete', params.row)}>
                <GridDeleteIcon />
              </IconButton>
            </div>
            
          ),
        },
      ] 
    }
  ]
  const [tabId, setTabId] = useState(TABS[0].id);
  const [tab, setTab] = useState(TABS[0]);

  useEffect(()=>{
    console.log(targetRow)
  },[targetRow])

  const answerFormSchema = z.object({
    id_bu: z.string().trim().optional().nullable(),
    id_informacao_tecnica: z.string().trim().optional().nullable(),
    informa_reposta: z.string().optional(),
  });

  const questionFormSchema = z.object({
    id_bu: z.string().trim().optional().nullable(),
    informacao: z.string().trim().optional().nullable(),
    descritivo: z.string().optional(),
  });

  const handleDeleteRow = (id) => {
    setFleetRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  
  const handleShowModal = (type, row) =>{
    
    setTargetRow(row)
    setShowModal(!showModal)
    setRenderType(type)

  }


  const handleChangeTab = (event, newTabId) => {
    setTabId(newTabId);
    setTab(()=>TABS.find((tab)=> tab.id === newTabId))

    switch(newTabId){
      case 'co2':
        setRows(co2Rows)
        break;
      case 'seo':
        setRows(seoRows)
        break;
      default:
        setRows([])
    }
  };

  const handleAction = (data) =>{
    console.log(data)
  }

  const NewAnswerForm = () => {
  
    return (
      <div className="flex flex-col gap-2">
        
        <Text6>Resposta:</Text6>
        
        <div className='flex gap-2'>
          <Input
            id='id_bu'
            defaultValue={targetRow ? targetRow.id_bu: ''}
            label="BU"
          />
  
          <Input
            id='id_informacao_tecnica'
            defaultValue={targetRow ? targetRow.id_informacao_tecnica: ''}
            label="Info Tecnica"
          />
        </div>   
  
        <Input
            id='informa_reposta'
            defaultValue={targetRow ? targetRow.informa_reposta: ''}
            label="Resposta"
        />
      </div>
    )
  }

  const NewQuestionForm = () => {
  
    return (
      <div className="flex flex-col gap-2">
        
        <Text6>Pergunta:</Text6>
        
        <div className='flex gap-2'>
          <Input
            id='id_bu'
            defaultValue={targetRow ? targetRow.id_bu: ''}
            label="BU"
          />
  
          <Input
            id='informacao'
            defaultValue={targetRow ? targetRow.informacao: ''}
            label="Informação"
          />
        </div>   
  
        <Input
            id='descritivo'
            defaultValue={targetRow ? targetRow.descritivo: ''}
            label="Descrição"
        />
      </div>
    )
  }

  const renderDeleteContent = () =>{
    switch(tabId){
      case 'bu_informacao_tecnica':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
              <div className="flex gap-2 ">
                <Text6>BU:</Text6>
                <Text6>{targetRow.id_bu}</Text6>
              </div>

              <div className="flex gap-2">
                <Text6>Info Tecnica:</Text6>
                <Text6>{targetRow.id_informacao_tecnica}</Text6>
              </div>
              <div className="flex gap-2">
                <Text6>Resposta:</Text6>
                <Text6>{targetRow.informa_reposta}</Text6>
              </div>
            </div>
        )
      case 'informacao_tecnica':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
            <div className="flex gap-2 ">
              <Text6>BU:</Text6>
              <Text6>{targetRow.id_bu}</Text6>
            </div>

            <div className="flex gap-2">
              <Text6>Pergunta:</Text6>
              <Text6>{targetRow.informacao}</Text6>
            </div>
            <div className="flex gap-2">
              <Text6>Descrição:</Text6>
              <Text6>{targetRow.descritivo}</Text6>
            </div>
          </div>
        )
      default: return <></>
    }
  }

  const renderContent = (type) =>{
    switch(type){
      case 'delete':
        return(
          <div className="space-y-16">
            
            {renderDeleteContent()}
            <div className="flex flex-col items-center justify-center w-full">
              <Button onClick={() => {handleShowModal('add')}}>
                <GridDeleteIcon /> Deletar
              </Button>
            </div>
          </div>
          
        )
      case 'add':
        switch(tabId){
          case 'bu_informacao_tecnica':
            return(
              <CustomForm
                onSubmit={handleAction}
                classNameForm="gap-2"
                  {... { zodSchema: answerFormSchema }}

              >
                <NewAnswerForm/>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <ActionButtons
                    onCancel={handleShowModal}
                    // isLoading={mutationHandler.isPending}
                    actionText="Enviar"
                  />
                </Box>
              </CustomForm>
            )
          case 'informacao_tecnica':
            return(
              <CustomForm
                onSubmit={handleAction}
                classNameForm="gap-2"
                  {... { zodSchema: questionFormSchema }}

              >
                <NewQuestionForm/>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <ActionButtons
                    onCancel={handleShowModal}
                    // isLoading={mutationHandler.isPending}
                    actionText="Enviar"
                  />
                </Box>
              </CustomForm>
            )
          default:
            return <></>
        }
      default: return <></>
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
      <DefaultModal show={showModal} closeModal={handleShowModal}>
          <div className="space-y-16">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center w-full">
                <Text5 className="px-4 font-semibold">{renderType === 'add' ? targetRow ? 'Editar' : 'Criar' : 'Deletar o item da lista: '} {tab.label}</Text5>
              </div>
              <Divider/>
              {renderContent(renderType)}
            </div>
          </div>
      </DefaultModal>
      <Paper elevation={3} sx={{ padding: 4, width: '90%' }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Listagens CO2
        </Typography>

        <TextField
          label={tab.searchText}
          variant="outlined"
          value={searchQuery}
          sx={{ marginBottom: 2, width: '25%' }}
        />

        <Button onClick={() => {handleShowModal('add')}}>
          <AddIcon /> Novo Registro
        </Button>

        <Box sx={{ height: '90%', width: '100%', marginTop: 4, overflowX: 'auto' }}>
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

          <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            rows={rows}
            // auto
            columns={tab.columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            getRowId={(row) => row.id}
            editMode="row"
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
