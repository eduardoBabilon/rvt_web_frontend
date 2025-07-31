import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
  FormHelperText,
  Paper
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { 
  ObraFormData, 
  ObraFormErrors,
  validateObra,
  formatDateForDisplay,
  EnumOption,
  formatNumeroContrato,
  validateNumeroContrato
} from '@/types/modules/obra';
import {
  getStatusObraOptions,
  getObraTipoOptions
} from '@/service/api/obra/obraService';
import { getFiscalizadoresAtivos } from '@/service/api/users/userService'
import { getActiveFiliais } from '@/service/api/filial/filialService'
import { getAllContratos } from '@/service/api/contrato/contratoService';
import { getAllClientes } from '@/service/api/clienteEmpresa/clienteEmpresaService';
import { formatCNPJ } from '@/types/modules/clienteEmpresa';

interface ObraDadosStepProps {
  obraData: ObraFormData;
  onDataChange: (data: ObraFormData) => void;
  onNext: () => void;
  loading?: boolean;
}

const ObraDadosStep: React.FC<ObraDadosStepProps> = ({
  obraData,
  onDataChange,
  onNext,
  loading = false
}) => {
  // Estados para opções dos selects
  const [statusOptions, setStatusOptions] = useState<EnumOption[]>([]);
  const [getObraTipos, setObraTipoOptions] = useState<any[]>([]);
  const [filialOptions, setFilialOptions] = useState<any[]>([]);

  //Seleção de clientes
  const [clienteOptions, setClienteOptions] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de loading
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingContratos, setLoadingContratos] = useState(false);
  
  // Estados de erro e validação
  const [errors, setErrors] = useState<ObraFormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Carregar opções iniciais
  useEffect(() => {
    loadInitialOptions();
  }, []);

  // Validar dados quando mudarem
  useEffect(() => {
    const validationErrors = validateObra(obraData);
    setErrors(validationErrors);
  }, [obraData]);

  const loadInitialOptions = async () => {
    try {
      setLoadingOptions(true);
      
      const [ statusData, obraTipoData, filialData] = await Promise.all([
        getStatusObraOptions(),
        getObraTipoOptions(),
        getActiveFiliais()
      ]);
      
      setStatusOptions(statusData);
      setObraTipoOptions(obraTipoData);
      setFilialOptions(filialData.data);
      
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadClientes = async (reset = false) => {
    if (loadingClientes || (!hasMore && !reset)) return;

    setLoadingClientes(true);

    try {
      const res = await getAllClientes(page, 10, {searchTerm});
      setClienteOptions(prev =>
        reset ? res.content : [...prev, ...res.content]
      );
      setHasMore(!res.last);
      setPage(prev => reset ? 1 : prev + 1);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoadingClientes(false);
    }
  };

  useEffect(() => {
    loadClientes(true); 
  }, [searchTerm]);

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 20
    ) {
      loadClientes();
    }
  };

  const handleFieldChange = (field: keyof ObraFormData, value: any) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const updatedData = { ...obraData, [field]: value };

    if (field === 'cliente') {
      updatedData.cliente_id = value?.id || '';
    }

    onDataChange(updatedData);
  };


  const handleBlur = (field: keyof ObraFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof ObraFormData) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };

  const hasFieldError = (field: keyof ObraFormData) => {
    return touched[field] && !!errors[field];
  };

  if (loadingOptions) {
    return (
      <Paper elevation={3} sx={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"400px"}}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Carregando formulário...
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BusinessIcon sx={{ mr: 1 }} />
        Dados Principais da Obra
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={3}>
        Preencha as informações básicas da obra. Todos os campos marcados com * são obrigatórios.
      </Typography>

      <Grid container spacing={3}>
        {/* Seção: Contrato e Identificação */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                Contrato e Identificação
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={hasFieldError('cliente_id')}
                    disabled={loading}
                  >
                    <Autocomplete
                      fullWidth
                      disabled={loading}
                      value={obraData.cliente || null}
                      inputValue={searchTerm}
                      onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                        setPage(0);
                        setClienteOptions([]);
                      }}
                      onChange={(event, newValue) => {
                        handleFieldChange('cliente', newValue);
                        setSearchTerm('');
                      }}
                      onBlur={() => handleBlur('cliente_id')}
                      options={clienteOptions}
                      getOptionLabel={(option) =>
                        option?.nome_empresa && option?.cnpj
                          ? `${option.nome_empresa} - ${formatCNPJ(option.cnpj)}`
                          : ''
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Cliente *"
                          error={hasFieldError('cliente_id')}
                          helperText={getFieldError('cliente_id')}
                        />
                      )}
                      ListboxProps={{
                        onScroll: handleScroll,
                        style: {
                          maxHeight: '300px',
                          overflow: 'auto',
                        },
                      }}
                      loading={loadingClientes}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Número do Contrato"
                    value={obraData.numero_contrato}
                    onChange={(e) => {
                      const formatted = formatNumeroContrato(e.target.value);
                      handleFieldChange('numero_contrato', formatted);
                    }}
                    onBlur={() => handleBlur('numero_contrato')}
                    error={hasFieldError('numero_contrato')}
                    helperText={getFieldError('numero_contrato')}
                    disabled={loading}
                  />
                </Grid>


                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome da Obra"
                    value={obraData.name_obra}
                    onChange={(e) => handleFieldChange('name_obra', e.target.value)}
                    onBlur={() => handleBlur('name_obra')}
                    error={hasFieldError('name_obra')}
                    helperText={getFieldError('name_obra')}
                    disabled={loading}
                  />
                </Grid>

              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Seção: Tipo e Status */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                Tipo e Status
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl 
                    fullWidth 
                    error={hasFieldError('obra_tipo_id')}
                    disabled={loading}
                  >
                    <InputLabel>Tipo de Obra *</InputLabel>
                    <Select
                      value={obraData.obra_tipo_id}
                      label="Tipo de Obra *"
                      onChange={(e) => handleFieldChange('obra_tipo_id', e.target.value)}
                      onBlur={() => handleBlur('obra_tipo_id')}
                    >
                      <MenuItem value="">
                        <em>Selecione o tipo</em>
                      </MenuItem>
                      {getObraTipos.map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          {tipo.tipo}
                        </MenuItem>
                      ))}
                    </Select>
                    {getFieldError('obra_tipo_id') && (
                      <FormHelperText>{getFieldError('obra_tipo_id')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl 
                    fullWidth 
                    error={hasFieldError('status_obra')}
                    disabled={loading}
                  >
                    <InputLabel>Status da Obra *</InputLabel>
                    <Select
                      value={obraData.status_obra}
                      label="Status da Obra *"
                      onChange={(e) => handleFieldChange('status_obra', e.target.value)}
                      onBlur={() => handleBlur('status_obra')}
                    >
                      <MenuItem value="">
                        <em>Selecione o status</em>
                      </MenuItem>
                      {statusOptions.map((status) => (
                        <MenuItem key={status.name} value={status.name}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {getFieldError('status_obra') && (
                      <FormHelperText>{getFieldError('status_obra')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl 
                    fullWidth 
                    error={hasFieldError('filial_id')}
                    disabled={loading}
                  >
                    <InputLabel>Filial *</InputLabel>
                    <Select
                      value={obraData.filial_id}
                      label="Filial *"
                      onChange={(e) => handleFieldChange('filial_id', e.target.value)}
                      onBlur={() => handleBlur('filial_id')}
                    >
                      <MenuItem value="">
                        <em>Selecione a filial</em>
                      </MenuItem>
                      {filialOptions.map((filial) => (
                        <MenuItem key={filial.id} value={filial.id}>
                          {filial.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {getFieldError('filial_id') && (
                      <FormHelperText>{getFieldError('filial_id')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Seção: Localização e Datas */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
                Localização e Cronograma
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Endereço *"
                    value={obraData.endereco}
                    onChange={(e) => handleFieldChange('endereco', e.target.value)}
                    onBlur={() => handleBlur('endereco')}
                    error={hasFieldError('endereco')}
                    helperText={getFieldError('endereco')}
                    disabled={loading}
                    multiline
                    rows={2}
                    placeholder="Rua, número, bairro, cidade, estado, CEP"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Início *"
                    type="datetime-local"
                    value={obraData.data_inicio}
                    onChange={(e) => handleFieldChange('data_inicio', e.target.value)}
                    onBlur={() => handleBlur('data_inicio')}
                    error={hasFieldError('data_inicio')}
                    helperText={getFieldError('data_inicio')}
                    disabled={loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Fim"
                    type="datetime-local"
                    value={obraData.data_fim}
                    onChange={(e) => handleFieldChange('data_fim', e.target.value)}
                    onBlur={() => handleBlur('data_fim')}
                    error={hasFieldError('data_fim')}
                    helperText={getFieldError('data_fim')}
                    disabled={loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumo de validação */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            Corrija os seguintes erros antes de continuar:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </Box>
  );
};

export default ObraDadosStep;

