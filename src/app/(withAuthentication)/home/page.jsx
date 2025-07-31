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
  Autocomplete,
  CircularProgress,
  MobileStepper,
} from '@mui/material';
import { Button } from '@/components/@shared/Button';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridDeleteIcon, ptBR } from '@mui/x-data-grid';
import colors from '@/styles/Theme/colors';
import { EditNote, KeyboardArrowLeft, KeyboardArrowRight, Visibility } from '@mui/icons-material';
import { DefaultModal } from '@/components/@shared/DefaultModal';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { ActionButtons } from '@/components/ActionButtons';
import { Text5, Text6 } from '@/components/@shared/Texts';
import { CustomForm } from '@/components/@shared/CustomForm';
import { Input } from '@/components/@shared/Input';
import CustomRichTextEditor from '@/components/@shared/CustomRichText';
import { z } from 'zod';
import { useAuthContext } from '@/contexts/Auth';
import { useSnackbarContext } from '@/contexts/Snackbar';
import { myMY } from '@mui/material/locale';
import { getDefaultAutoCompleteValue } from '@/utils/getDefaultAutoCompleteValue';
import CustomInputFile from '@/components/@shared/CustomInputFile';
import { useMCCService } from '@/hooks/useMCCService';



export default function ListagensCentral() {
  const { getAllBU, 
          createBU, 
          createFamilia, 
          createFrota, 
          createModelo,
          getAllFamilia,
          getAllFrota,
          getAllModelo,
          updateFrota,
          updateModelo,
          updateFamilia,
          updateBU,
          getAllManyBU,
          getAllManyFamilia,
          getAllManyModelo,
          deleteBU,
          deleteFamilia,
          deleteFrota,
          deleteModelo,
          getAllFotoModelo,
          createFotoModelo,
          deleteFotoModelo           
        } = useMCCService();
  const {dispatchSnackbar} = useSnackbarContext()
  const { user } = useAuthContext();
  const { isAdmin } = user ?? {};
  const { primary } = colors.brand;
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [targetRow, setTargetRow] = useState({})
  const [targetPhoto, setTargetPhoto] = useState({})
  const [renderType, setRenderType] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingModal, setIsLoadingModal] = useState(true)
  const [modalSelect, setModalSelect] = useState([])
  const [rows, setRows] = useState([])
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [activeStep, setActiveStep] = useState(0)
  
  const TABS = [
    {
      id:'bu',
      enabled: true,
      label: 'BU',
      searchText: 'Buscar por BU',
      columns: [
        {field: 'nome', headerName: 'Nome', flex: 1, },
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row, 'bu')} disabled={isAdmin}>
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
      id:'familia',
      enabled: true,
      label: 'Família',
      searchText: 'Buscar por família',
      columns:
      [
        {field: 'nome', headerName: 'Familia', flex: 1  },
        {field: 'bu.nome', headerName: 'BU', flex: 1, valueGetter: (params) => params.row.bu.nome },
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row, 'familia')} disabled={isAdmin}>
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
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row, 'modelo')} disabled={isAdmin}>
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
      id:'frota',
      enabled: true,
      label: 'Frota',
      searchText: 'Buscar número de frota',
      columns: [
        {field: 'numeroFrota', headerName: 'Número de frota', flex: 1, },
        {field: 'modelo.nome', headerName: 'Modelo',  flex: 1, valueGetter: (params) => params.row.modelo.nome  },
        {field: 'status', headerName: 'Status', flex: 1 , renderCell: (params)=>params.value ? 'ativo' : 'inativo'  },
        {field: 'isRental', headerName: 'Rental', flex: 1, renderCell: (params)=>params.value ? 'ativo' : 'inativo'   },
        {
          field: "actions",
          headerName: "Ações",
          sortable: false,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('add', params.row, 'frota')} disabled={isAdmin}>
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
      id:'foto_modelo',
      enabled: true,
      label: 'Foto Modelo',
      searchText: 'Buscar por modelo',
      columns: [
        {field: 'nome_modelo', headerName: 'Modelo', flex: 1, },
        {field: 'fotos', headerName: 'Quantidade de Fotos', flex: 1, valueGetter: (params) => params.row.foto.length },
        {field: 'fotoMae', headerName: 'Contem Foto Mãe', flex: 1, valueGetter: (params)=> validateMotherPhoto(params.row.foto  ) ? 'Sim' : 'Não'  },
        {
          field: "actions",
          headerName: "Ações",
          // flex: 1,
          renderCell: (params) => (
            <div style={{display:'flex'}}>
              <IconButton onClick={() => handleShowModal('view', params.row)} disabled={isAdmin}>
                <Visibility />
              </IconButton>
              {/* <IconButton onClick={() => handleShowModal('add', params.row)} disabled={isAdmin}>
                <EditNote />
              </IconButton> */}
              <IconButton onClick={() => handleShowModal('delete', params.row)} disabled={isAdmin}>
                <GridDeleteIcon />
              </IconButton>
            </div>
            
          ),
        },
      ] 
    },
  ]
  const modelTABS = [
    { 
      id:'model',
      enabled: true,
      label: 'Modelo',
    },
    { 
      id:'co2',
      enabled: true,
      label: 'Co2',
    },
    { 
      id:'seo',
      enabled: true,
      label: 'SEO',
    },
    { 
      id:'info_extra',
      enabled: true,
      label: 'Info Extra',
    }

  ]

  const [tabId, setTabId] = useState('bu');
  const [tab, setTab] = useState(TABS[0]);

  const [modelTabId, setModelTabId] = useState(modelTABS[0].id);
  const [modelTab, setModelTab] = useState(modelTABS[0]);

  useEffect(()=>{
    getAllBU({page: 0}).then(
      response =>{
        let myList = response.data.content

        const responseTotalItems = response.data.page.totalElements

        setTotalItemCount(responseTotalItems)
        setRows(myList)
        setIsLoading(false)
      }
    )
  }, [])

  const fleetFormSchema = z.object({
    id: z.string().trim().optional().nullable(),
    numeroFrota: z.string().trim().nonempty({message: 'Favor preencher o número da frota.'}),
    modelo: z.object({
      id: z.string().trim(),
    }), 
    status: z.boolean(),
    isRental: z.boolean(),
  });

  const modelFormSchema = z.object({
    id: z.string().trim().optional().nullable(),
    nome: z.string().trim().nonempty({message: 'Preencher o nome do modelo.'}),
    descricao: z.string().trim().nonempty({message: 'Preencher a descrição.'}),
    titulo: z.string().trim().nonempty({message: 'Preencher o titulo.'}),
    sobreEquipamento: z.string().trim(),
    familiaDTO: z.object({
      id_familia: z.string().trim(),
    }), 
    status: z.boolean(),
    co2DTO: z.object({
      id: z.string().optional().nullable(),
      producao: z.number().optional().nullable(),
      frete: z.number().optional().nullable(),
      operacao: z.number().optional().nullable(),
      manutencao: z.string().nonempty({message: 'Preencher manutenção.'}),
      descarte: z.string().nonempty({message: 'Preencher descarte.'}),
      massa: z.string().nonempty({message: 'Preencher massa.'}),
    }),
    seoDTO: z.object({
      id: z.string().optional().nullable(),
      descricaoMeta: z.string().nonempty({message: 'Preencher decrição meta.'}),
      palavrasChave: z.string().nonempty({message: 'Preencher palavras chave.'}),
      tagTitulo: z.string().nonempty({message: 'Preencher tag titulo.'}),
      slugUrl: z.string().optional().nullable(),
    }),
    manualBase64: z.string().trim().optional().nullable(),
    technicalBase64: z.string().trim().optional().nullable(),
    iconBase64: z.string().trim().optional().nullable(),
    categoria: z.string().trim().optional().nullable(),
  });
  
  const familyFormSchema = z.object({
    id: z.string().trim().optional().nullable(),
    nome: z.string().trim().nonempty({message: 'Favor preencher o nome da familia.'}),
    bu: z.object({
      id: z.string().trim(),
    })
  });

  const buFormSchema = z.object({
    id: z.string().trim().optional().nullable(),
    nome: z.string().trim().nonempty({message: 'Favor preencher o nome da bu.'}),
  });

  const modelPhotoSchema = z.object({
    id: z.string().trim().optional().nullable(),
    modelo: z.object({
      id: z.string().trim(),
    }),
    tipoFoto: z.string().trim(),
    isFotoMae: z.boolean(),
    fotoBase64: z.string().trim().optional().nullable(), 
  });

  const validateMotherPhoto = (photoList) =>{

    let validation = false

    photoList.map((photo)=>{
      if(photo.isFotoMae){
        validation = true
      }
    })

    return validation
  }

  const handleDeleteRow = async() => {
    
    const handleResponse = () =>{
      let myList = rows.filter(item=>item.id !== targetRow.id)

      setRows(myList)

      setTotalItemCount(totalItemCount - 1)
      dispatchSnackbar({ type: 'success', message: 'Registro excluido com sucesso!' });
      handleShowModal()
    }
    
    switch(tabId){
      case 'familia':{
        deleteFamilia({id: targetRow.id}).then(response=>{
          handleResponse()
        }).catch(
          error=>{dispatchSnackbar({ type: 'error', message: 'Erro ao excluir registro!' });}
        )
        break;
      }
      case 'modelo':{
        deleteModelo({id: targetRow.id}).then(response=>{
          handleResponse()
        }).catch(
          error=>{dispatchSnackbar({ type: 'error', message: 'Erro ao excluir registro!' });}
        )
        break;
      }
      case 'frota':{
        deleteFrota({id: targetRow.id}).then(response=>{
          handleResponse()
        }).catch(
          error=>{dispatchSnackbar({ type: 'error', message: 'Erro ao excluir registro!' });}
        )
        break;
      }
      case 'bu':{
        deleteBU({id: targetRow.id}).then(response=>{
          handleResponse()
        }).catch(
          error=>{dispatchSnackbar({ type: 'error', message: 'Erro ao excluir registro!' });}
        )
        break;
      }
      case 'foto_modelo':{
        deleteFotoModelo({id: targetPhoto.id}).then(()=>{
          let myRow = targetRow
          let myList = []
          myRow.foto = myRow.foto.filter(item=>item.id !== targetPhoto.id)

          if(myRow.foto.length === 0){
            myList = rows.filter(item=>item.id_modelo !== myRow.id_modelo)
            setTotalItemCount(totalItemCount - 1)
          }else{
            myList = rows.map(item=> item.id_modelo === myRow.id_modelo ? myRow : item)
          }

          setRows(myList)
          dispatchSnackbar({ type: 'success', message: 'Registro excluido com sucesso!' });
          handleShowModal()
        })
        break;
      }
      default: return ''
    }
    
  }; 

  const handleShowModal = (type, row, myTab) =>{
    
    setTargetRow(row)
    setShowModal(!showModal)
    setRenderType(type)
    setModelTabId('model')
    setActiveStep(0)

    let actualTab = myTab ? myTab : tabId
    
    if(type == 'add'){
      setIsLoadingModal(true)
      switch(actualTab){
        case 'familia':{
          getAllManyBU().then(response=>{
            setModalSelect(response.data ? response.data : [] )
            setIsLoadingModal(false)
          }).catch(
            error=>{console.log(error)}
          )
          break;
        }
        case 'modelo':{
          getAllManyFamilia().then(response=>{
            setModalSelect(response.data ? response.data : [] )
            setIsLoadingModal(false)
          }).catch(
            error=>{console.log(error)}
          )
          break;
        }
        case 'foto_modelo':
        case 'frota':{
          getAllManyModelo().then(response=>{
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
 
  const handleChangeTab = async(event, newTabId) => {
    setTabId(newTabId);
    setIsLoading(true)
    setTab(()=>TABS.find((tab)=> tab.id === newTabId))

    await handlePageChange(0, newTabId)
  };

  const handleChangeModelTab = (event, newTabId) => {
    setModelTabId(newTabId);
    setModelTab(()=>modelTABS.find((tab)=> tab.id === newTabId))
  };

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
      case 'frota':
        getAllFrota(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'modelo':
        getAllModelo(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'familia':
        getAllFamilia(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'bu':
        getAllBU(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'foto_modelo':
        getAllFotoModelo(param).then(
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
        case 'frota':
          createFrota(data).then(
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
        case 'modelo':
          createModelo(data).then(
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
        case 'familia':
          createFamilia(data).then(
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
        case 'bu':
          createBU(data).then(
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
        case 'foto_modelo':
          createFotoModelo(data).then(
            response =>{
              const myResponse = response.data
              let validation = false
              let myList = rows.map(item=>{
                if(item.id_modelo === myResponse.id_modelo){
                  validation = true
                  return myResponse  
                } 
                  return item
              })
              
              
              if(!validation){
                if(rows.length === 10)
                  setTotalItemCount(totalItemCount + 1)
                else
                  myList.push(myResponse)
              }

              setRows(myList)
              dispatchSnackbar({ type: 'success', message: 'Registro criado com sucesso!' });
              handleShowModal()
            }
           )
           .catch(
            error=>{
              dispatchSnackbar({ type: 'error', message: 'Erro ao inserir registro!' });
            }
          )
          break;
        default:
          return ''
      }
    }
    else{
      switch(tabId){
        case 'frota':
          updateFrota(data, {id: data.id}).then(
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
        case 'modelo':
          updateModelo(data, {id: data.id}).then(
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
        case 'familia':
          updateFamilia(data, {id: data.id}).then(
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
        case 'bu':
          updateBU(data, {id: data.id}).then(
            response =>{
              handleResponse(response)
            }
          )
          .catch(
            error=>{
              dispatchSnackbar({ type: 'error', message: 'Erro ao editar registro!' });
              console.log(error)
            }
          )
          break;
        default:
          return ''
      }
    }
  }

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
      case 'frota':
        getAllFrota(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'modelo':
        getAllModelo(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'familia':
        getAllFamilia(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'bu':
        getAllBU(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      case 'foto_modelo':
        getAllFotoModelo(param).then(
          response =>{    
            handleGetResponse(response)
          }
         )
        break;
      default: return ''
    }
  }

  const NewFleetForm = () => {

    const { setValue, control, formState: { errors } } = useFormContext();
    

    const autoCompleteOptions = {
      status:[
        { label: 'Ativo', value: true },
        { label: 'Inativo', value: false },
      ],
      isRental:[
        { label: 'Sim', value: true },
        { label: 'Não', value: false },
      ]
    } 
  
    return (
      <div className="flex flex-col gap-2">
        {isLoadingModal ? 
          <div className="flex items-center justify-center flex-grow h-[300px]">
            <CircularProgress sx={{ color: '#F37021' }} />
          </div>
        :
          <>
            <Text6>Frota:</Text6>


            <Input
              id='id'
              defaultValue={targetRow ? targetRow.id: ''}
              hidden
              className='hidden'
            />

            <Input
              id='numeroFrota'
              defaultValue={targetRow ? targetRow.numeroFrota: ''}
              label="Numero da Frota"
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
                        error={errorModelo} // Indica erro no campo
                        helperText={errorModelo ? 'Selecionar Modelo' : ''} // Exibe mensagem de erro
                      />
                    )}
                  />
                )
              }}
            />
            

            <Controller
              control={control}
              name='status_render'
              render={({ field }) => {
                const errorStatus = errors?.status 
                return(
                  <Autocomplete
                    {...field}
                    onChange={(e, newValue) => {
                      setValue('status', newValue?.value);
                      setValue('status_render', newValue);
                    }}
                    disablePortal
                    options={autoCompleteOptions.status}
                    // getOptionLabel={(option) => option.label || ""}
                    // isOptionEqualToValue={(option, value) => option.value === value}
                    id='status_render'
                    defaultValue={()=>{
                      if(targetRow){
                        return getDefaultAutoCompleteValue({id: 'status', value: targetRow.status, valueList: autoCompleteOptions.status, setValue: setValue})
                      }
                      return null
                    }}
                    renderInput={(params) => 
                      <TextField
                        {...params}
                        label="Status"
                        error={errorStatus} // Indica erro no campo
                        helperText={errorStatus ? 'Selecionar status' : ''} // Exibe mensagem de erro
                      />
                    }
                  />
                )
              }}
            />

            <Controller
              control={control}
              name='isRental_render'
              render={({ field }) => {
                const erorrIsRental = errors?.isRental 
                return(
                <Autocomplete
                  {...field}
                  onChange={(e, newValue) => {
                    setValue('isRental', newValue?.value);
                    setValue('isRental_render', newValue);
                  }}
                  disablePortal
                  options={autoCompleteOptions.isRental}
                  // getOptionLabel={(option) => option.label || ""}
                  // isOptionEqualToValue={(option, value) => option.value === value}
                  id='isRental_render'
                  defaultValue={()=>{
                    if(targetRow){
                      return getDefaultAutoCompleteValue({id: 'isRental', value: targetRow.isRental, valueList: autoCompleteOptions.isRental, setValue: setValue})
                    }
                    return null
                  }}
                  renderInput={(params) => 
                    <TextField
                      {...params}
                      label="Rental"
                      error={erorrIsRental} // Indica erro no campo
                      helperText={erorrIsRental ? 'Selecionar Rental ' : ''} // Exibe mensagem de erro
                    />
                  }
                />
              )}}
            />
          </>
        }
        

      </div>
    )
  }

  const RenderModelForm = () => {

    const { setValue, control, formState: { errors } } = useFormContext();
    const reader = new FileReader();
    const [teste, setTeste] = useState('')

    const statusOptions = [
      { label: 'Ativo', value: true },
      { label: 'Inativo', value: false },
    ]
    
    switch(modelTabId){
      case 'model':
       return(
        <div className="flex flex-col gap-2 h-[480px] overflow-y-auto">
          <div className='flex gap-2'>
           
           <div className='hidden'>
            <Input
                id='id'
                defaultValue={targetRow ? targetRow.id: ''}
                className='hidden'
            />
           </div>
            
         
            <Input
              id='nome'
              defaultValue={targetRow ? targetRow.nome : ''}
              label="Nome"
            />
    
            <Input
              id='descricao'
              defaultValue={targetRow ? targetRow.descricao : ''}
              label="Descrição"
            />
          </div> 

          <Input
            id='titulo'
            defaultValue={targetRow ? targetRow.titulo : ''}
            label="Titulo"
          /> 
          
          <Controller
            control={control}
            name='id_familia_render'
            render={({ field }) => {
              const errorFamilia = errors?.familiaDTO 
              return (
                <Autocomplete
                  {...field}
                  onChange={(e, newValue) => {
                    setValue('familiaDTO.id_familia', newValue?.value);
                    setValue('id_familia_render', newValue);
                  }}
                  disablePortal
                  options={modalSelect.map(item=>({label:item.nome, value:item.id}))}
                  id='id_familia_render'
                  defaultValue={()=>{
                    if(targetRow){
                      let myList = modalSelect.map(item=>({label:item.nome, value:item.id}))
                      return getDefaultAutoCompleteValue({id: 'familiaDTO.id_familia', value: targetRow.familia.id, valueList: myList, setValue: setValue})
                    }
                    return null
                  }}
                  renderInput={(params) => 
                    <TextField
                        {...params}
                        label="Familia"
                        error={!!errorFamilia} // Indica erro no campo
                        helperText={errorFamilia ? 'Selecionar Familia' : ''} // Exibe mensagem de erro
                      />
                  }
                />
              )
            }}
          />
          
    
          <Controller
            control={control}
            name='status_render'
            render={({ field }) => {
              const errorStatus = errors?.status 
              return (
                <Autocomplete
                  {...field}
                  onChange={(e, newValue) => {
                    setValue('status', newValue?.value);
                    setValue('status_render', newValue);
                  }}
                  disablePortal
                  options={statusOptions}
                  // getOptionLabel={(option) => option.label || ""}
                  // isOptionEqualToValue={(option, value) => option.value === value}
                  id='status_render'
                  defaultValue={()=>{
                    if(targetRow){
                      return getDefaultAutoCompleteValue({id: 'status', value: targetRow.status, valueList: statusOptions, setValue: setValue})
                    }
                    return null
                  }}
                  renderInput={(params) => 
                    <TextField
                        {...params}
                        label="Status"
                        error={!!errorStatus} // Indica erro no campo
                        helperText={errorStatus ? 'Selecionar Status' : ''} // Exibe mensagem de erro
                      />
                  }
                />  
              )
          }}
          />

          <CustomRichTextEditor 
            defaultValue={targetRow ? targetRow.sobreEquipamento : ''} 
            id='sobreEquipamento'
            label='Sobre Equipamento'
          />

        </div>
       )
      case 'co2':
        return (
          <div className='flex flex-col gap-2'>

              <Input
                id='co2DTO.id'
                defaultValue={targetRow ? targetRow.co2.id : ''}
                className='hidden'
              /> 

            <div className='flex gap-2'>
              <Input
                id='co2DTO.producao'
                defaultValue={targetRow ? targetRow.co2.producao : 0}
                type='number'
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('co2DTO.producao', value === '' ? '' : Number(value)); 
                }}
                label="Produção"
              />

              <Input
                id='co2DTO.frete'
                defaultValue={targetRow ? targetRow.co2.frete : 0}
                type='number'
                label="Frete"
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('co2DTO.frete', value === '' ? '' : Number(value)); 
                }}
              />  
            </div>

            <div className='flex gap-2'>
              <Input
                id='co2DTO.operacao'
                defaultValue={targetRow ? targetRow.co2.operacao : 0}
                type='number'
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('co2DTO.operacao', value === '' ? '' : Number(value)); 
                }}
                label="Operação"
              />

              <Input
                id='co2DTO.manutencao'
                defaultValue={targetRow ? targetRow.co2.manutencao : ''}
                label="Manutenção"
              /> 
            </div>

            <div className='flex gap-2'>
              <Input
                id='co2DTO.descarte'
                defaultValue={targetRow ? targetRow.co2.descarte : ''}
                label="Descarte"
              />

              <Input
                id='co2DTO.massa'
                defaultValue={targetRow ? targetRow.co2.massa : ''}
                label="Massa"
              />
            </div>
           
            
          </div>
        )
      case 'seo':
        return (
          <div className='flex flex-col gap-2'>
              <Input
                id='seoDTO.id'
                defaultValue={targetRow ? targetRow.seo.id : ''}
                className='hidden'
              /> 
              <Input
                id='seoDTO.descricaoMeta'
                defaultValue={targetRow ? targetRow.seo.descricaoMeta : ''}
                label="Descrição"
              /> 

              <Input
                id='seoDTO.palavrasChave'
                defaultValue={targetRow ? targetRow.seo.palavrasChave : ''}
                label="Palavras Chave"
              /> 
      
              <Input
                id='seoDTO.tagTitulo'
                defaultValue={targetRow ? targetRow.seo.tagTitulo : ''}
                label="Titulo"
              /> 

              <Input
                id='seoDTO.slugUrl'
                defaultValue={targetRow ? targetRow.seo.slugUrl : ''}
                label="URL"
              />
          </div>
        )
      case 'info_extra':
        return (
          <div className='flex flex-col gap-2'>
             
             <CustomInputFile
              id='manualBase64'
              inputProps={{ accept: "application/pdf" }}
              label='upload manual'
              defaultValue={targetRow ? targetRow.manualBase64 : ''}
              linkLabel='Link Manual'
             />

            <CustomInputFile
              id='technicalBase64'
              inputProps={{ accept: "application/pdf" }}
              label='upload técnico'
              defaultValue={targetRow ? targetRow.technicalBase64 : ''}
              linkLabel='Link Técnico'
             />

              
      
            <CustomInputFile
              id='iconBase64'
              inputProps={{ accept: "image/*" }}
              label='upload Icone'
              defaultValue={targetRow ? targetRow.iconBase64 : ''}
              linkLabel='Link Icone'
             />

              <Input
                id='categoria'
                defaultValue={targetRow ? targetRow.categoria : ''}
                label="Categoria"
              />
          </div>
        )       
    }
  }

  const NewModelForm = () => {

    return (
      <div >
        
        <Text6>Modelo:</Text6>

        <Tabs
          value={modelTabId}
          onChange={handleChangeModelTab}
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
          {modelTABS.map((tab) => {
            return <Tab key={tab.label} value={tab.id} label={tab.label} disabled={!tab.enabled} />;
          })}
        </Tabs>

        {isLoadingModal ? 
          <div className="flex items-center justify-center flex-grow h-[300px]">
            <CircularProgress sx={{ color: '#F37021' }} />
          </div>
        :
          <>
            {RenderModelForm()}
          </>
        }
        
      </div>
    )
  }

  const NewFamilyForm = () => {

    const { setValue, control, formState: { errors } } = useFormContext();

    return (
      <>
        {isLoadingModal ? 
          <div className="flex items-center justify-center flex-grow h-[300px]">
            <CircularProgress sx={{ color: '#F37021' }} />
          </div>
        :
          <div className="flex flex-col gap-1 pb-10">
          
            <Text6>Familia:</Text6>

              
              <Input
              id='id'
              defaultValue={targetRow ? targetRow.id: ''}
              className='hidden'
              />
              
            
              <Input
                id='nome'
                defaultValue={targetRow ? targetRow.nome : ''}
                label="Nome Familia"
              />

              <Controller
                control={control}
                name="bu_id_render"
                render={({ field }) => {
                  const errorBuId = errors?.bu 

                  return (
                    <Autocomplete
                      {...field}
                      onChange={(e, newValue) => {
                        setValue("bu.id", newValue?.value, { shouldValidate: true });
                        setValue("bu_id_render", newValue);
                      }}
                      disablePortal
                      options={modalSelect.map((item) => ({ label: item.nome, value: item.id }))}
                      id="bu_id_render"
                      defaultValue={() => {
                        if (targetRow) {
                          let myList = modalSelect.map((item) => ({ label: item.nome, value: item.id }));
                          return getDefaultAutoCompleteValue({ id: "bu.id", value: targetRow.bu.id, valueList: myList, setValue: setValue });
                        }
                        return null;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="BU"
                          error={!!errorBuId} // Se houver erro, ativa o estado de erro
                          helperText={errorBuId? 'Selecionar BU' : ''} // Exibe mensagem de erro de "bu.id"
                        />
                      )}
                    />
                  );
                }}
              />

          
          </div>
        }
      </>
      
    )
  }

  const NewBUForm = () => {

    return (
      <div className="flex flex-col gap-2">
        
        <Text6>BU:</Text6>

          <Input
            id='id'
            defaultValue={targetRow ? targetRow.id: ''}
            hidden
          />
        
          <Input
            id='nome'
            defaultValue={targetRow ? targetRow.nome : ''}
            label="Nome da BU"
          />
       
      </div>
    )
  }

  const NewModelPhotoForm = () => {
    const { setValue, control, formState: { errors } } = useFormContext();
    const [fileText, setFileText] = useState('')
    const reader = new FileReader();

    return (
      <div className="flex flex-col gap-2">
        
        <Text6>Foto Modelo:</Text6>

          <Input
            id='id'
            defaultValue={targetRow ? targetRow.id: ''}
            hidden
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
                  defaultValue={null}
                  renderInput={(params) => 
                    <TextField
                        {...params}
                        label="Modelo"
                        error={!!errorModelo} // Indica erro no campo
                        helperText={errorModelo ? 'Selecionar Modelo' : ''} // Exibe mensagem de erro
                      />
                  }
                />
              )
            }}
            />

            <Controller
              control={control}
              name='isFotoMae_render'
              render={({ field }) => {
                const errorIsFotoMae = errors?.isFotoMae 
                return(
                  <Autocomplete
                    {...field}
                    onChange={(e, newValue) => {
                      setValue('isFotoMae', newValue?.value);
                      setValue('isFotoMae_render', newValue);
                    }}
                    disablePortal
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false },
                    ]}
                    // getOptionLabel={(option) => option.label || ""}
                    // isOptionEqualToValue={(option, value) => option.value === value}
                    id='isFotoMae_render'
                    defaultValue={null}
                    renderInput={(params) => 
                      <TextField
                        {...params}
                        label="Foto Mãe"
                        error={!!errorIsFotoMae} // Indica erro no campo
                        helperText={errorIsFotoMae ? 'Selecionar resposta' : ''} // Exibe mensagem de erro
                      />
                    }
                  />
                )
              }}
            />

            <CustomInputFile
              id='fotoBase64'
              inputProps={{ accept: "image/*" }}
              type='tipoFoto'
              label='upload foto'
            />

            {/* <TextField 
              type="file"
              inputProps={{ accept: "image/*" }}
              id='fotoBase64'
              onChange={(e)=>{
                let file = e.target.files[0]
                setFileText(file.name)
                reader.readAsDataURL(file);
                setValue('tipoFoto', file.type.split('/')[1])

                reader.onload = () => {
                  const base64String = reader.result.split(',')[1]; // Pega apenas a parte base64
                  setValue('fotoBase64', base64String); // Armazena no estado
                };
                reader.onerror = (error) => {
                  console.error("Erro ao converter para Base64:", error);
                };
              }}
              hidden
            />
          
            <label htmlFor="fotoBase64">
              <div className='cursor-pointer duration-200 hover:bg-[#f69a62] active:bg-[#f37021] flex items-center justify-center gap-2 p-3  h-10 bg-brand-primary text-white rounded-md text-sm shadow-md uppercase'>
                Upload Foto
              </div>
            </label>
            <div>{fileText}</div> */}
      </div>
    )
  }

  useEffect(()=>{
    if(targetRow?.foto?.length > 0){
      setTargetPhoto(targetRow.foto[activeStep])
    }
  },[activeStep, targetRow])

  const ImageStepper = ({activeStep, setActiveStep, targetRow}) => {
    const maxSteps = targetRow.foto.length;
    const [isLoadingImage, setIsLoadingImage] = useState(true)

    const handleNext = () => {
      if(maxSteps > 1)
        setIsLoadingImage(true)

      setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
    };
  
    const handleBack = () => {
      if(maxSteps > 1)
        setIsLoadingImage(true)

      setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps)
    };
  
    return (
      <Box sx={{ maxWidth: 800, flexGrow: 1, mx: "auto", mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {isLoadingImage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <CircularProgress sx={{ color: "#F37021" }} />
          </div>
        )}
          <img
            src={targetRow.foto[activeStep].url}
            alt={`Slide ${activeStep + 1}`}
            style={{ 
              width: "100%", 
              maxWidth: "600px", 
              height: "400px", 
              objectFit: "contain", 
              borderRadius: 8
            }}
            onLoad={()=>{setIsLoadingImage(false)}}
          
          />
        </Box>
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{ backgroundColor: "transparent", 
                justifyContent: "center", 
                gap:10, 
                "& .MuiMobileStepper-dotActive": {
                  backgroundColor: "#f37021", 
                }, 
          }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={maxSteps <= 1}>
              Próximo
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={maxSteps <= 1}>
              <KeyboardArrowLeft />
              Anterior
            </Button>
          }
        />
      </Box>
    );
  };

  const renderDeleteContent = () =>{
    switch(tabId){
      case 'frota':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
              <div className="flex gap-2 ">
                <Text6>Número de Frota:</Text6>
                <Text6>{targetRow.numero_frota}</Text6>
              </div>

              <div className="flex gap-2">
                <Text6>Modelo:</Text6>
                <Text6>{targetRow.modelo.nome}</Text6>
              </div>
              <div className="flex gap-2">
                <Text6>Status:</Text6>
                <Text6>{targetRow.status ? 'ativo' : 'inativo'}</Text6>
              </div>

              <div className="flex gap-2">
                <Text6>Rental:</Text6>
                <Text6>{targetRow.is_rental ? 'ativo' : 'inativo'}</Text6>
              </div>
            </div>
        )
      case 'modelo':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
            <div className="flex gap-2 ">
              <Text6>Nome:</Text6>
              <Text6>{targetRow.nome}</Text6>
            </div>

            <div className="flex gap-2">
              <Text6>Descrição:</Text6>
              <Text6>{targetRow.descricao}</Text6>
            </div>
            <div className="flex gap-2">
              <Text6>Titulo:</Text6>
              <Text6>{targetRow.titulo}</Text6>
            </div>

            <div className="flex gap-2">
              <Text6>Sobre Equipamento:</Text6>
              <Text6>{targetRow.sobreEquipamento }</Text6>
            </div>

            <div className="flex gap-2 ">
              <Text6>Familia:</Text6>
              <Text6>{targetRow.familia.nome}</Text6>
            </div>

            <div className="flex gap-2">
              <Text6>Status:</Text6>
              <Text6>{targetRow.status ? 'ativo' : 'inativo'}</Text6>
            </div>

          </div>
        )
      case 'familia':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
            <div className="flex gap-2 ">
              <Text6>Familia:</Text6>
              <Text6>{targetRow.nome}</Text6>
            </div>

            <div className="flex gap-2">
              <Text6>BU:</Text6>
              <Text6>{targetRow.bu.nome}</Text6>
            </div>            
        </div>
        )
      case 'bu':
        return(
          <div className="flex flex-col gap-5 max-w px-4 text-text-light mt-2">
              <div className="flex gap-2 ">
                <Text6>Nome:</Text6>
                <Text6>{targetRow.nome}</Text6>
              </div>
          </div>
        )
      case 'foto_modelo':
        return(
          <>
            <ImageStepper
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              targetRow={targetRow}
            />
          </>
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
          case 'frota':
            return(
              <CustomForm
                onSubmit={handleAction}
                classNameForm="gap-2"
                  {... { zodSchema: fleetFormSchema }}

              >
                <NewFleetForm/>
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
          case 'modelo':
            return(
              <CustomForm
                onSubmit={handleAction}
                classNameForm="gap-2"
                  {... { zodSchema: modelFormSchema }}

              >
                <NewModelForm/>
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
          case 'familia':
            return(
              <CustomForm
                onSubmit={handleAction}
                classNameForm="gap-2"
                  {... { zodSchema: familyFormSchema }}

              >
                <NewFamilyForm/>
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
          case 'bu':
            return(
                <CustomForm
                  onSubmit={handleAction}
                  classNameForm="gap-2"
                    {... { zodSchema: buFormSchema }}
  
                >
                  <NewBUForm/>
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
          case 'foto_modelo':
            return(
              <CustomForm
                  onSubmit={handleAction}
                  classNameForm="gap-2"
                    {... { zodSchema: modelPhotoSchema }}
  
                >
                  <NewModelPhotoForm/>
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
      case 'view':
        return(
          <>
            <ImageStepper
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              targetRow={targetRow}
            />
          </>
        )
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
                {renderType === 'view' ? 
                    <Text5 className="px-4 font-semibold">Visualizar Fotos</Text5>
                  :
                    <Text5 className="px-4 font-semibold">{renderType === 'add' ? targetRow ? 'Editar' : 'Criar' : 'Deletar o item da lista: '} {tab.label}</Text5> 
                }
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
              getRowId={(row) => tabId === 'foto_modelo' ? row.id_modelo : row.id}
              editMode="row"
              experimentalFeatures={{ newEditingApi: true }}
            />
          }
        </Box>
      </Paper>
    </Box>
  );
}
