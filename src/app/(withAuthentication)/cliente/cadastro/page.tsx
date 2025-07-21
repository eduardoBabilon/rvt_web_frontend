'use client';

import React, { useState } from 'react';
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
  Collapse
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  Person,
  Save,
  Cancel,
  CheckCircle,
  Info,
  Warning
} from '@mui/icons-material';
import { 
  ClienteEmpresaFormData, 
  CadastroClienteProps,
  CLIENTE_EMPRESA_VALIDATION,
  CLIENTE_EMPRESA_ERROR_MESSAGES,
  formatCNPJ,
  formatTelefone,
} from '@/types/modules/clienteEmpresa';
import { 
  createCliente, 
  validateCNPJ,
  validateCNPJFormat, 
  validateEmail,
  cleanClienteEmpresaFormData 
} from '@/service/api/clienteEmpresa/clienteEmpresaService';

const steps = ['Dados da Empresa', 'Informações de Contato', 'Confirmação'];

export default function CadastroCliente({ 
  onSuccess, 
  onCancel 
}: CadastroClienteProps): React.ReactElement {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ClienteEmpresaFormData>({
    nome_empresa: '',
    cnpj: '',
    contato_nome: '',
    contato_telefone: '',
    email: ''
  });

  // Função para validar campo individual
  const validateField = async (field: keyof ClienteEmpresaFormData, value: string) => {
    const errors: Record<string, string> = {};

    switch (field) {
      case 'nome_empresa':
        if (!value.trim()) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.NOME_EMPRESA_REQUIRED;
        } else if (value.trim().length < CLIENTE_EMPRESA_VALIDATION.NOME_EMPRESA.MIN_LENGTH) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.NOME_EMPRESA_MIN_LENGTH;
        } else if (value.trim().length > CLIENTE_EMPRESA_VALIDATION.NOME_EMPRESA.MAX_LENGTH) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.NOME_EMPRESA_MAX_LENGTH;
        }
        break;

      case 'cnpj':
        if (!value.trim()) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.CNPJ_REQUIRED;
        } else {
          const cleanCNPJ = value.replace(/\D/g, '');
          if (!validateCNPJFormat(cleanCNPJ)) {
            errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.CNPJ_INVALID;
          } else {
            // Verificar se CNPJ já existe
            try {
              const isValid = await validateCNPJ(cleanCNPJ);
              if (!isValid) {
                errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.CNPJ_ALREADY_EXISTS;
              }
            } catch (err) {
              console.error('Erro ao validar CNPJ:', err);
            }
          }
        }
        break;

      case 'email':
        if (!value.trim()) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.EMAIL_REQUIRED;
        } else if (!CLIENTE_EMPRESA_VALIDATION.EMAIL.PATTERN.test(value)) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.EMAIL_INVALID;
        } else {
          // Verificar se email já existe
          try {
            const isValid = await validateEmail(value.trim());
            if (!isValid) {
              errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS;
            }
          } catch (err) {
            console.error('Erro ao validar email:', err);
          }
        }
        break;

      case 'contato_nome':
        if (value.trim() && value.trim().length < CLIENTE_EMPRESA_VALIDATION.CONTATO_NOME.MIN_LENGTH) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.CONTATO_NOME_MIN_LENGTH;
        } else if (value.trim().length > CLIENTE_EMPRESA_VALIDATION.CONTATO_NOME.MAX_LENGTH) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.CONTATO_NOME_MAX_LENGTH;
        }
        break;

      case 'contato_telefone':
        if (value.trim() && !CLIENTE_EMPRESA_VALIDATION.CONTATO_TELEFONE.PATTERN.test(value)) {
          errors[field] = CLIENTE_EMPRESA_ERROR_MESSAGES.CONTATO_TELEFONE_INVALID;
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
  const handleFieldChange = (field: keyof ClienteEmpresaFormData, value: string) => {
    let formattedValue = value;

    // Aplicar formatação específica
    if (field === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (field === 'contato_telefone') {
      formattedValue = formatTelefone(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Função para validar step atual
  const validateCurrentStep = async () => {
    let isValid = true;

    if (activeStep === 0) {
      // Validar dados da empresa
      const nomeValid = await validateField('nome_empresa', formData.nome_empresa);
      const cnpjValid = await validateField('cnpj', formData.cnpj);
      isValid = nomeValid && cnpjValid;
    } else if (activeStep === 1) {
      // Validar informações de contato
      const emailValid = await validateField('email', formData.email);
      let contatoNomeValid = true;
      let contatoTelefoneValid = true;

      if (formData.contato_nome.trim()) {
        contatoNomeValid = await validateField('contato_nome', formData.contato_nome);
      }
      if (formData.contato_telefone.trim()) {
        contatoTelefoneValid = await validateField('contato_telefone', formData.contato_telefone);
      }

      isValid = emailValid && contatoNomeValid && contatoTelefoneValid;
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

      const cleanData = cleanClienteEmpresaFormData(formData);
      const newCliente = await createCliente(cleanData);
      
      setSuccess('Cliente cadastrado com sucesso!');
      
      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(newCliente);
      }

      // Reset do formulário
      setFormData({
        nome_empresa: '',
        cnpj: '',
        contato_nome: '',
        contato_telefone: '',
        email: ''
      });
      setActiveStep(0);
      
    } catch (err: any) {
      console.error('Erro ao cadastrar cliente:', err);
      
      // Tratar erros específicos do backend
      if (err.message?.includes('CNPJ já cadastrado')) {
        setError('CNPJ já está cadastrado para outro cliente.');
        setActiveStep(0); // Voltar para o step do CNPJ
      } else if (err.message?.includes('Email já cadastrado')) {
        setError('Email já está cadastrado para outro cliente.');
        setActiveStep(1); // Voltar para o step do email
      } else {
        setError('Erro ao cadastrar cliente. Verifique os dados e tente novamente.');
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
        nome_empresa: '',
        cnpj: '',
        contato_nome: '',
        contato_telefone: '',
        email: ''
      });
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de Cliente
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preencha as informações abaixo para cadastrar um novo cliente
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
          {/* Step 0: Dados da Empresa */}
          {activeStep === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Business sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Dados da Empresa</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome da Empresa"
                    value={formData.nome_empresa}
                    onChange={(e) => handleFieldChange('nome_empresa', e.target.value)}
                    error={!!validationErrors.nome_empresa}
                    helperText={validationErrors.nome_empresa}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CNPJ"
                    value={formData.cnpj}
                    onChange={(e) => handleFieldChange('cnpj', e.target.value)}
                    error={!!validationErrors.cnpj}
                    helperText={validationErrors.cnpj || 'Formato: XX.XXX.XXX/XXXX-XX'}
                    required
                    placeholder="00.000.000/0000-00"
                    inputProps={{ maxLength: 18 }}
                  />
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Certifique-se de que o CNPJ está correto, pois ele será usado para identificar a empresa no sistema.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* Step 1: Informações de Contato */}
          {activeStep === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Informações de Contato</Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome do Contato"
                    value={formData.contato_nome}
                    onChange={(e) => handleFieldChange('contato_nome', e.target.value)}
                    error={!!validationErrors.contato_nome}
                    helperText={validationErrors.contato_nome || 'Opcional'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefone do Contato"
                    value={formData.contato_telefone}
                    onChange={(e) => handleFieldChange('contato_telefone', e.target.value)}
                    error={!!validationErrors.contato_telefone}
                    helperText={validationErrors.contato_telefone || 'Opcional - Formato: (XX) XXXXX-XXXX'}
                    placeholder="(11) 99999-9999"
                    inputProps={{ maxLength: 15 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Alert severity="warning" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                  O email será usado para comunicações importantes. Certifique-se de que está correto e ativo.
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
                      Dados da Empresa
                    </Typography>
                    <Typography variant="body2">
                      <strong>Nome:</strong> {formData.nome_empresa}
                    </Typography>
                    <Typography variant="body2">
                      <strong>CNPJ:</strong> {formatCNPJ(formData.cnpj)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Informações de Contato
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {formData.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contato:</strong> {formData.contato_nome || 'Não informado'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Telefone:</strong> {formData.contato_telefone ? formatTelefone(formData.contato_telefone) : 'Não informado'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Dados validados! Clique em "Finalizar Cadastro" para salvar o cliente.
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
                disabled={loading}
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