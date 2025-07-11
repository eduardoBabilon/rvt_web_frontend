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
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { Button } from '@/components/@shared/Button';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridDeleteIcon, ptBR } from '@mui/x-data-grid';
import { useMCCService } from '@/hooks/useMCCService';
import colors from '@/styles/Theme/colors';
import { EditNote } from '@mui/icons-material';
import { DefaultModal } from '@/components/@shared/DefaultModal';
import { Input } from '@/components/@shared/Input';
import { Text5, Text6 } from '@/components/@shared/Texts';
import { ActionButtons } from '@/components/ActionButtons';
import { CustomForm } from '@/components/@shared/CustomForm';
import { z } from 'zod';
import { useAuthContext } from '@/contexts/Auth';
import { useSnackbarContext } from '@/contexts/Snackbar';
import { Controller, useFormContext } from 'react-hook-form';
import { getDefaultAutoCompleteValue } from '@/utils/getDefaultAutoCompleteValue';


export default function Listagens() {
  const { 
    createModeloInfoTecnica, 
    createInfoTecnica,
    getAllModeloInfoTecnica,
    getAllInfoTecnica,
    getAllManyModelo,
    updateInfoTenica,
    updateModeloInfoTenica,
    deleteModeloInfoTenica,
    deleteInfoTenica,
    getAllManyInfoTecnica
  } = useMCCService();
  const { dispatchSnackbar } = useSnackbarContext();
  const { primary } = colors.brand;
  const { user } = useAuthContext();
  const { isAdmin } = user ?? {};
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [renderType, setRenderType] = useState('')
  const [targetRow, setTargetRow] = useState({})
  const [modalSelect, setModalSelect] = useState([])
  const [rows, setRows] = useState([])
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})

  
  
  const TABS = [
    {
      id:'informacao_tecnica',
      enabled: true,
      label: 'Informação Técnica',
      searchText: 'Buscar por modelo',
      columns: [
        {field: 'modelo.nome', headerName: 'Modelo',  flex: 1, valueGetter: (params) => params.row.modelo.nome  },
        {field: 'informacao', headerName: 'Informação', flex: 1},
        {field: 'descritivo', headerName: 'Descrição', flex: 1 },
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row, 'informacao_tecnica')} disabled={isAdmin}>
                <EditNote />
              </IconButton>
              <IconButton onClick={() => handleShowModal('delete', params.row)} disabled={isAdmin}>
                <GridDeleteIcon />
              </IconButton>
            </div>
            
          ),
        },
      ] 
    },
    {
      id:'modelo_informacao_tecnica',
      enabled: true,
      label: 'Modelo Informação Técnica',
      searchText: 'Buscar por informação técnica',
      columns: [
        {field: 'informacaoTecnica.informacao', headerName: 'Info Tecnica', flex: 1, valueGetter: (params) => params.row.informacaoTecnica.informacao },
        {field: 'informaResposta', headerName: 'Reposta', flex: 1},
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row, 'modelo_informacao_tecnica')} disabled={isAdmin}>
                <EditNote />
              </IconButton>
              <IconButton onClick={() => handleShowModal('delete', params.row)} disabled={isAdmin}>
                <GridDeleteIcon />
              </IconButton>
            </div>
            
          ),
        },
      ] 
    },
    
  ]
  const [tabId, setTabId] = useState(TABS[0].id);
  const [tab, setTab] = useState(TABS[0]);

  useEffect(()=>{
      getAllInfoTecnica({page: 0}).then(
        response =>{
          let myList = response.data.content
  
          const responseTotalItems = response.data.page.totalElements
  
          setTotalItemCount(responseTotalItems)
          setRows(myList)
          setIsLoading(false)
        }
      )
    }, [])

  const answerFormSchema = z.object({
    id: z.string().trim().optional().nullable(),
    informacaoTecnicaDTO: z.object({
      id: z.string().trim(),
    }),
    informaResposta: z.string().nonempty({message: 'Preencher informação.'}),
  });

  const questionFormSchema = z.object({
    id: z.string().trim().optional().nullable(),
    modelo: z.object({
      id: z.string().trim(),
    }),
    informacao: z.string().trim().nonempty({message: 'Preencher informação.'}),
    descritivo: z.string().trim().nonempty({message: 'Preencher descrição.'}),
  });

  const handleDeleteRow = async() => {
    
    const handleResponse = () =>{
      let myList = rows.filter(item=>item.id !== targetRow.id)

      setRows(myList)

      setTotalItemCount(totalItemCount - 1)
      dispatchSnackbar({ type: 'success', message: 'Registro excluido com sucesso!' });
      handleShowModal()
    }
    
    switch(tabId){
      case 'modelo_informacao_tecnica':{
        deleteModeloInfoTenica({id: targetRow.id}).then(response=>{
          handleResponse()
        }).catch(
          error=>{dispatchSnackbar({ type: 'error', message: 'Erro ao excluir registro!' });}
        )
        break;
      }
      case 'informacao_tecnica':{
        deleteInfoTenica({id: targetRow.id}).then(response=>{
          handleResponse()
        }).catch(
          error=>{dispatchSnackbar({ type: 'error', message: 'Erro ao excluir registro!' });}
        )
        break;
      }
      default: return ''
    }
    
  }; 

  
  const handleShowModal = (type, row, myTab) =>{
    
    setTargetRow(row)
    setShowModal(!showModal)
    setRenderType(type)

    let actualTab = myTab ? myTab : tabId
    
    if(type == 'add'){
      setIsLoadingModal(true)
      switch(actualTab){
        case 'informacao_tecnica':{
          getAllManyModelo().then(response=>{
            setModalSelect(response.data ? response.data : [] )
            setIsLoadingModal(false)
          }).catch(
            error=>{console.log(error)}
          )
          break;
        }
        case 'modelo_informacao_tecnica':{
          getAllManyInfoTecnica().then(response=>{
            setModalSelect(response.data ? response.data : [] )
            setIsLoadingModal(false)
          }).catch(
            error=>{console.log(error)}
          )
          break;
        }
        
        default: return ''
      }
    }

  }

  const handleSearchBar = async(event) =>{
    let value = event.target.value
    const param = {page: paginationModel.page, nome: value}
    setSearchQuery(value)
    setIsLoading(true)

    const handleGetResponse = (response) =>{
      const responseTotalItems = response.data.page.totalElements
      const responseList = response.data.content

      setTotalItemCount(responseTotalItems)
      setRows(responseList)
      setIsLoading(false)
    }

    switch(tabId){
      case 'informacao_tecnica':
        getAllInfoTecnica(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'modelo_informacao_tecnica':
        getAllModeloInfoTecnica(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      default: return ''
    }
  }

  const handleChangeTab = async(event, newTabId) => {
    setTabId(newTabId);
    setIsLoading(true)
    setTab(()=>TABS.find((tab)=> tab.id === newTabId))

    await handlePageChange(0, newTabId)
  };

  const handlePageChange = async(data, newTabId) =>{
    const param = {page: data.page ? data.page : 0, nome: searchQuery}
    const myNewPagination = data !== undefined ? data === 0 ? {page: 0, pageSize: 10} : data : paginationModel

    const handleGetResponse = (response) =>{
      const responseTotalItems = response.data.page.totalElements
      const responseList = response.data.content

      setTotalItemCount(responseTotalItems)
      setRows(responseList)
      setIsLoading(false)
    }

    setPaginationModel(myNewPagination)

    switch(newTabId ? newTabId : tabId){
      case 'informacao_tecnica':
        getAllInfoTecnica(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'modelo_informacao_tecnica':
        getAllModeloInfoTecnica(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      default: return ''
    }
  }

  const handleAction = async(data) =>{
    
    const handleResponse = (response) =>{
      if(data.id === ''){
        if(rows.length < 10){
          let myList = rows.map(item=>item)

          myList.push(response.data)

          setRows(myList)
        }
        setTotalItemCount(totalItemCount + 1)
        dispatchSnackbar({ type: 'success', message: 'Registro criado com sucesso!' });
      }else{
        dispatchSnackbar({ type: 'success', message: 'Registro editado com sucesso!' });
        const updatedList = rows.map(item=>
          item.id === data.id ? response.data : item
        )
        setRows(updatedList)
      }

      handleShowModal()
    }

    if(data.id === ''){
      switch(tabId){
        case 'modelo_informacao_tecnica':
          createModeloInfoTecnica(data).then(
            response =>{
             handleResponse(response)
            }
          )
          .catch(
          error=>{
            dispatchSnackbar({ type: 'error', message: 'Erro ao inserir registro!' });
            console.log(error)
          }
          )
          break;
        case 'informacao_tecnica':
          createInfoTecnica(data).then(
            response =>{
              handleResponse(response)
            }
          )
          .catch(
          error=>{
            dispatchSnackbar({ type: 'error', message: 'Erro ao inserir registro!' });
          }
          )
          break;
        default: return ''
      }
    }
    else{
      switch(tabId){
        case 'modelo_informacao_tecnica':
          updateModeloInfoTenica(data, {id: data.id}).then(
            response =>{
              handleResponse(response)
            }
          )
          .catch(
            error=>{
              dispatchSnackbar({ type: 'error', message: 'Erro ao editar registro!' });
            }
          )
          break;
        case 'informacao_tecnica':
          updateInfoTenica(data, {id: data.id}).then(
            response =>{
              handleResponse(response)
            }
          )
          .catch(
            error=>{
              dispatchSnackbar({ type: 'error', message: 'Erro ao editar registro!' });
            }
          )
          break;
        default: return ''
      }
    }
  }

  const NewAnswerForm = () => {
  
    const { setValue, control, formState: { errors } } = useFormContext();

    return (
      <>
        {isLoadingModal ?
            <div className="flex items-center justify-center flex-grow h-[300px]">
              <CircularProgress sx={{ color: '#F37021' }} />
            </div>
          :
            <div className="flex flex-col gap-2">
            
              <Text6>Resposta:</Text6>
      
                <Input
                  id='id'
                  defaultValue={targetRow ? targetRow.id: ''}
                  className='hidden'
                />
      
                <Controller
                  control={control}
                  name='informacaoTecnicaDTO_id_render'
                  render={({ field }) => {
                    const errorInformacaoTecnica = errors?.informacaoTecnicaDTO
                    return(
                      <Autocomplete
                        {...field}
                        onChange={(e, newValue) => {
                          setValue('informacaoTecnicaDTO.id', newValue?.value);
                          setValue('informacaoTecnicaDTO_id_render', newValue);
                        }}
                        disablePortal
                        options={modalSelect.map(item=>({label:item.informacao, value:item.id}))}
                        // getOptionLabel={(option) => option.label || ""}
                        // isOptionEqualToValue={(option, value) => option.value === value}
                        noOptionsText='Sem Perguntas possíveis'
                        id='informacaoTecnicaDTO_id_render'
                        defaultValue={()=>{
                          if(targetRow){
                            let myList = modalSelect.map(item=>({label:item.informacao, value:item.id}))
                            return getDefaultAutoCompleteValue({id: 'informacaoTecnicaDTO.id', value: targetRow.informacaoTecnica.id, valueList: myList, setValue: setValue})
                          }
                          return null
                        }}
                        renderInput={(params) => 
                          <TextField
                          {...params}
                          label="Informação Técnica"
                          error={!!errorInformacaoTecnica} // Indica erro no campo
                          helperText={errorInformacaoTecnica ? 'Selecionar informação' : ''} // Exibe mensagem de erro
                        />
                        }
                      />
                    )
                  }}
                />
        
              <Input
                  id='informaResposta'
                  defaultValue={targetRow ? targetRow.informaResposta: ''}
                  label="Resposta"
              />
            </div>
        }
      </>
    )
  }

  const NewQuestionForm = () => {
  
    const { setValue, control, formState: { errors } } = useFormContext();

    return (
      <>
        {isLoadingModal ?
            <div className="flex items-center justify-center flex-grow h-[300px]">
              <CircularProgress sx={{ color: '#F37021' }} />
            </div>
          :
            <div className="flex flex-col gap-2">
          
              <Text6>Pergunta:</Text6>

              <Input
                  id='id'
                  defaultValue={targetRow ? targetRow.id: ''}
                  className='hidden'
                />
              
              <Controller
                control={control}
                name='modelo_id_render'
                render={({ field }) => {
                  const errorModelo = errors?.modelo
                  return(
                    <Autocomplete
                      {...field}
                      onChange={(e, newValue) => {
                        setValue('modelo.id', newValue?.value);
                        setValue('modelo_id_render', newValue);
                      }}
                      disablePortal
                      options={modalSelect.map(item=>({label:item.nome, value:item.id}))}
                      // getOptionLabel={(option) => option.label || ""}
                      // isOptionEqualToValue={(option, value) => option.value === value}
                      noOptionsText='Sem modelos possíveis'
                      id='modelo_id_render'
                      defaultValue={()=>{
                        if(targetRow){
                          let myList = modalSelect.map(item=>({label:item.nome, value:item.id}))
                          return getDefaultAutoCompleteValue({id: 'modelo.id', value: targetRow.modelo.id, valueList: myList, setValue: setValue})
                        }
                        return null
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Modelo"
                          error={!!errorModelo} // Indica erro no campo
                          helperText={errorModelo ? 'Selecionar Modelo' : ''} // Exibe mensagem de erro
                        />
                      )}
                    />
                  )
                }}
              />       

              <Input
                id='informacao'
                defaultValue={targetRow ? targetRow.descritivo: ''}
                label="Informação"
              />

              <Input
                  id='descritivo'
                  defaultValue={targetRow ? targetRow.descritivo: ''}
                  label="Descrição"
              />
            </div>
        }
      </>
      
    )
  }

  const renderDeleteContent = () =>{
    switch(tabId){
      case 'modelo_informacao_tecnica':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
              
              <div className="flex gap-2">
                <Text6>Info Tecnica:</Text6>
                <Text6>{targetRow.informacaoTecnica.informacao}</Text6>
              </div>
              <div className="flex gap-2">
                <Text6>Resposta:</Text6>
                <Text6>{targetRow.informaResposta}</Text6>
              </div>
            </div>
        )
      case 'informacao_tecnica':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
            <div className="flex gap-2 ">
              <Text6>Modelo:</Text6>
              <Text6>{targetRow.modelo.nome}</Text6>
            </div>

            <div className="flex gap-2">
              <Text6>Informação:</Text6>
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
              <Button onClick={() => {handleDeleteRow()}}>
                <GridDeleteIcon /> Deletar
              </Button>
            </div>
          </div>
          
        )
      case 'add':
        switch(tabId){
          case 'modelo_informacao_tecnica':
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
          Listagens
        </Typography>

        <TextField
          label={tab.searchText}
          variant="outlined"
          value={searchQuery}
          sx={{ marginBottom: 2, width: '25%' }}
          onChange={handleSearchBar}
        />

        <Button onClick={() => {handleShowModal('add')}} hidden={!isAdmin}>
          <AddIcon /> Novo Registro
        </Button>

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
              rows={rows}
              columns={tab.columns}
              paginationMode='server'
              rowCount={totalItemCount}
              paginationModel={paginationModel}
              onPaginationModelChange={(newPagination)=>{  
                setIsLoading(!isLoading)            
                handlePageChange(newPagination)
              }}
              getRowId={(row) => row.id}
              editMode="row"
              experimentalFeatures={{ newEditingApi: true }}
            />
          }
        </Box>
      </Paper>
    </Box>
  );
}
