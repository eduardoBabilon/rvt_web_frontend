'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import {
  Business,
  Description,
  CalendarToday,
  Schedule,
  Save,
  Cancel,
  CheckCircle,
  Info,
  Warning
} from '@mui/icons-material';
import { 
  ContratoFormData, 
  CadastroContratoProps,
  CONTRATO_VALIDATION,
  CONTRATO_ERROR_MESSAGES,
  formatNumeroContrato,
  validateNumeroContrato,
  validateDateRange,
  formatDateForInput,
  calculateContractDuration
} from '@/types/modules/contrato';
import { ClienteEmpresa } from '@/types/modules/clienteEmpresa'
import { 
  createContrato, 
  validateNumeroContrato as validateNumeroContratoExists,
  cleanContratoFormData 
} from '@/service/api/contrato/contratoService';
import { getClientesAtivos } from '@/service/api/clienteEmpresa/clienteEmpresaService';

const steps = ['Seleção do Cliente', 'Dados do Contrato', 'Confirmação'];

export default function CadastroContrato({ 
  onSuccess, 
  onCancel 
}: CadastroContratoProps): React.ReactElement {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [clientes, setClientes] = useState<ClienteEmpresa[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClienteEmpresa | null>(null);

  const [formData, setFormData] = useState<ContratoFormData>({
    numero_contrato: '',
    data_inicio: '',
    data_fim: '',
    cliente_empresa_id: ''
  });

  // Carregar clientes ativos na inicialização
  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoadingClientes(true);
        const clientesData = await getClientesAtivos();
        setClientes(clientesData);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setError('Erro ao carregar lista de clientes. Tente novamente.');
      } finally {
        setLoadingClientes(false);
      }
    };

    loadClientes();
  }, []);

  // Função para validar campo individual
  const validateField = async (field: keyof ContratoFormData, value: string) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case 'cliente_empresa_id':
        if (!value.trim()) {
          errors[field] = CONTRATO_ERROR_MESSAGES.CLIENTE_EMPRESA_ID_REQUIRED;
        }
        break;

      case 'numero_contrato':
        if (!value.trim()) {
          errors[field] = CONTRATO_ERROR_MESSAGES.NUMERO_CONTRATO_REQUIRED;
        } else {
          const cleanNumber = value.replace(/\D/g, '');
          if (!validateNumeroContrato(cleanNumber)) {
            errors[field] = CONTRATO_ERROR_MESSAGES.NUMERO_CONTRATO_INVALID;
          } else {
            // Verificar se número já existe
            try {
              const isValid = await validateNumeroContratoExists(cleanNumber);
              if (!isValid) {
                errors[field] = CONTRATO_ERROR_MESSAGES.NUMERO_CONTRATO_ALREADY_EXISTS;
              }
            } catch (err) {
              console.error('Erro ao validar número do contrato:', err);
            }
          }
        }
        break;

      case 'data_inicio':
        if (!value.trim()) {
          errors[field] = CONTRATO_ERROR_MESSAGES.DATA_INICIO_REQUIRED;
        }
        break;

      case 'data_fim':
        if (!value.trim()) {
          errors[field] = CONTRATO_ERROR_MESSAGES.DATA_FIM_REQUIRED;
        } else if (formData.data_inicio && !validateDateRange(formData.data_inicio, value)) {
          errors[field] = CONTRATO_ERROR_MESSAGES.DATA_FIM_BEFORE_INICIO;
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: errors[field] || ''
    }));

    return Object.keys(errors).length === 0;
  };

  // Função para lidar com mudanças nos campos
  const handleFieldChange = (field: keyof ContratoFormData, value: string) => {
    let formattedValue = value;

    // Aplicar formatação específica
    if (field === 'numero_contrato') {
      formattedValue = formatNumeroContrato(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Atualizar cliente selecionado se for mudança de cliente
    if (field === 'cliente_empresa_id') {
      const cliente = clientes.find(c => c.id === value);
      setSelectedCliente(cliente || null);
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Validar data_fim quando data_inicio mudar
    if (field === 'data_inicio' && formData.data_fim) {
      validateField('data_fim', formData.data_fim);
    }
  };

  // Função para validar step atual
  const validateCurrentStep = async () => {
    let isValid = true;

    if (activeStep === 0) {
      // Validar seleção do cliente
      const clienteValid = await validateField('cliente_empresa_id', formData.cliente_empresa_id);
      isValid = clienteValid;
    } else if (activeStep === 1) {
      // Validar dados do contrato
      const numeroValid = await validateField('numero_contrato', formData.numero_contrato);
      const dataInicioValid = await validateField('data_inicio', formData.data_inicio);
      const dataFimValid = await validateField('data_fim', formData.data_fim);
      isValid = numeroValid && dataInicioValid && dataFimValid;
    }

    return isValid;
  };

  // Função para avançar step
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Função para voltar step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Função para submeter formulário
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validação final
      const isValid = await validateCurrentStep();
      if (!isValid) {
        setError('Por favor, corrija os erros antes de continuar.');
        return;
      }

      const cleanData = cleanContratoFormData(formData);
      const newContrato = await createContrato(cleanData);
      
      setSuccess('Contrato cadastrado com sucesso!');
      
      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(newContrato);
      }

      // Reset do formulário
      setFormData({
        numero_contrato: '',
        data_inicio: '',
        data_fim: '',
        cliente_empresa_id: ''
      });
      setSelectedCliente(null);
      setActiveStep(0);
      
    } catch (err: any) {
      console.error('Erro ao cadastrar contrato:', err);
      
      // Tratar erros específicos do backend
      if (err.message?.includes('Número do contrato já cadastrado')) {
        setError('Número do contrato já está cadastrado.');
        setActiveStep(1); // Voltar para o step do número
      } else if (err.message?.includes('Cliente não encontrado')) {
        setError('Cliente selecionado não foi encontrado.');
        setActiveStep(0); // Voltar para o step do cliente
      } else {
        setError('Erro ao cadastrar contrato. Verifique os dados e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para cancelar
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset do formulário
      setFormData({
        numero_contrato: '',
        data_inicio: '',
        data_fim: '',
        cliente_empresa_id: ''
      });
      setSelectedCliente(null);
      setActiveStep(0);
      setValidationErrors({});
      setError(null);
      setSuccess(null);
    }
  };

  // Função para fechar alertas
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Calcular duração do contrato
  const contractDuration = formData.data_inicio && formData.data_fim 
    ? calculateContractDuration(formData.data_inicio, formData.data_fim)
    : 0;

  if (loadingClientes) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de Contrato
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preencha as informações abaixo para cadastrar um novo contrato
        </Typography>
      </Box>

      {/* Alertas */}
      <Collapse in={!!error}>
        <Alert severity="error" onClose={handleCloseAlert} sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>
      
      <Collapse in={!!success}>
        <Alert severity="success" onClose={handleCloseAlert} sx={{ mb: 2 }}>
          {success}
        </Alert>
      </Collapse>

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Formulário */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Step 0: Seleção do Cliente */}
          {activeStep === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Business sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Seleção do Cliente</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!validationErrors.cliente_empresa_id}>
                    <InputLabel>Cliente *</InputLabel>
                    <Select
                      value={formData.cliente_empresa_id}
                      onChange={(e) => handleFieldChange('cliente_empresa_id', e.target.value)}
                      label="Cliente *"
                    >
                      {clientes.map((cliente) => (
                        <MenuItem key={cliente.id} value={cliente.id}>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {cliente.nome_empresa}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {cliente.email}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {validationErrors.cliente_empresa_id && (
                      <FormHelperText>{validationErrors.cliente_empresa_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {selectedCliente && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Cliente Selecionado
                      </Typography>
                      <Typography variant="body2">
                        <strong>Empresa:</strong> {selectedCliente.nome_empresa}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {selectedCliente.email}
                      </Typography>
                      {selectedCliente.contato_nome && (
                        <Typography variant="body2">
                          <strong>Contato:</strong> {selectedCliente.contato_nome}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                )}
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Selecione o cliente para o qual o contrato será criado. Apenas clientes ativos são exibidos.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Step 1: Dados do Contrato */}
          {activeStep === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Description sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Dados do Contrato</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Número do Contrato"
                    value={formData.numero_contrato}
                    onChange={(e) => handleFieldChange('numero_contrato', e.target.value)}
                    error={!!validationErrors.numero_contrato}
                    helperText={validationErrors.numero_contrato || 'Deve conter exatamente 10 dígitos'}
                    required
                    placeholder="1234567890"
                    inputProps={{ maxLength: 10 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Início"
                    type="datetime-local"
                    value={formData.data_inicio}
                    onChange={(e) => handleFieldChange('data_inicio', e.target.value)}
                    error={!!validationErrors.data_inicio}
                    helperText={validationErrors.data_inicio}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Fim"
                    type="datetime-local"
                    value={formData.data_fim}
                    onChange={(e) => handleFieldChange('data_fim', e.target.value)}
                    error={!!validationErrors.data_fim}
                    helperText={validationErrors.data_fim}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {contractDuration > 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                      <Typography variant="body2" color="primary.main">
                        <strong>Duração do Contrato:</strong> {contractDuration} dias
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Certifique-se de que as datas estão corretas. A data de fim deve ser posterior à data de início.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Step 2: Confirmação */}
          {activeStep === 2 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Confirmação dos Dados</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Revise as informações antes de finalizar o cadastro:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cliente
                    </Typography>
                    <Typography variant="body2">
                      <strong>Empresa:</strong> {selectedCliente?.nome_empresa}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedCliente?.email}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Dados do Contrato
                    </Typography>
                    <Typography variant="body2">
                      <strong>Número:</strong> {formData.numero_contrato}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data de Início:</strong> {formData.data_inicio ? new Date(formData.data_inicio).toLocaleString('pt-BR') : ''}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data de Fim:</strong> {formData.data_fim ? new Date(formData.data_fim).toLocaleString('pt-BR') : ''}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Duração:</strong> {contractDuration} dias
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Dados validados! Clique em "Finalizar Cadastro" para salvar o contrato.
                </Typography>
              </Alert>
            </Box>
          )}
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={activeStep === 0 ? handleCancel : handleBack}
            startIcon={<Cancel />}
            disabled={loading}
          >
            {activeStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (activeStep === 0 && !formData.cliente_empresa_id)}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{ 
                  bgcolor: 'success.main',
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                {loading ? 'Salvando...' : 'Finalizar Cadastro'}
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};

