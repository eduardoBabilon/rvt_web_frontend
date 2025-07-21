import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Divider
} from '@mui/material';
import {
  Save,
  Cancel,
  Business,
  Description,
  CalendarToday,
  Schedule,
  Info
} from '@mui/icons-material';
import { 
  ContratoModalProps, 
  ContratoFormData,
  CONTRATO_ERROR_MESSAGES,
  formatNumeroContrato,
  validateNumeroContrato,
  validateDateRange,
  formatDateForInput,
  calculateContractDuration
} from '@/types/modules/contrato';
import { ClienteEmpresa } from '@/types/modules/clienteEmpresa'
import { validateNumeroContrato as validateNumeroContratoExists } from '@/service/api/contrato/contratoService';
import { getClientesAtivos } from '@/service/api/clienteEmpresa/clienteEmpresaService';

export const ContratoModal: React.FC<ContratoModalProps> = ({
  open,
  contrato,
  onClose,
  onSave,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<ContratoFormData>({
    numero_contrato: '',
    data_inicio: '',
    data_fim: '',
    cliente_empresa_id: ''
  });

  const [clientes, setClientes] = useState<ClienteEmpresa[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClienteEmpresa | null>(null);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);

  // Carregar clientes ativos
  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoadingClientes(true);
        const clientesData = await getClientesAtivos();
        setClientes(clientesData);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setLocalError('Erro ao carregar lista de clientes.');
      } finally {
        setLoadingClientes(false);
      }
    };

    if (open) {
      loadClientes();
    }
  }, [open]);

  // Preencher formulário quando contrato for fornecido (modo edição)
  useEffect(() => {
    if (open && contrato && mode === 'edit') {
      setFormData({
        numero_contrato: contrato.numero_contrato,
        data_inicio: formatDateForInput(contrato.data_inicio),
        data_fim: formatDateForInput(contrato.data_fim),
        cliente_empresa_id: contrato.cliente_empresa_id
      });

      // Encontrar cliente selecionado
      const cliente = clientes.find(c => c.id === contrato.cliente_empresa_id);
      setSelectedCliente(cliente || null);
    } else if (open && mode === 'create') {
      // Limpar formulário para criação
      setFormData({
        numero_contrato: '',
        data_inicio: '',
        data_fim: '',
        cliente_empresa_id: ''
      });
      setSelectedCliente(null);
    }
  }, [open, contrato, mode, clientes]);

  // Limpar estados quando modal fechar
  useEffect(() => {
    if (!open) {
      setValidationErrors({});
      setLocalError(null);
      setSelectedCliente(null);
    }
  }, [open]);

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
            // Verificar se número já existe (excluindo o próprio contrato na edição)
            try {
              const excludeId = mode === 'edit' && contrato ? contrato.id : undefined;
              const isValid = await validateNumeroContratoExists(cleanNumber, excludeId);
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

  // Função para validar formulário completo
  const validateForm = async () => {
    const fields: (keyof ContratoFormData)[] = [
      'cliente_empresa_id',
      'numero_contrato', 
      'data_inicio', 
      'data_fim'
    ];

    const validationPromises = fields.map(field => validateField(field, formData[field]));
    const results = await Promise.all(validationPromises);
    
    return results.every(result => result);
  };

  // Função para submeter formulário
  const handleSubmit = async () => {
    try {
      setLocalError(null);

      // Validar formulário
      const isValid = await validateForm();
      if (!isValid) {
        setLocalError('Por favor, corrija os erros antes de continuar.');
        return;
      }

      // Chamar função de salvamento
      await onSave(formData);
      
    } catch (err: any) {
      console.error('Erro ao salvar contrato:', err);
      setLocalError('Erro ao salvar contrato. Tente novamente.');
    }
  };

  // Calcular duração do contrato
  const contractDuration = formData.data_inicio && formData.data_fim 
    ? calculateContractDuration(formData.data_inicio, formData.data_fim)
    : 0;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" />
          <Typography variant="h6">
            {mode === 'create' ? 'Novo Contrato' : 'Editar Contrato'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        {loadingClientes ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Seleção do Cliente */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="primary" />
                Cliente
              </Typography>
              
              <FormControl fullWidth error={!!validationErrors.cliente_empresa_id}>
                <InputLabel>Cliente *</InputLabel>
                <Select
                  value={formData.cliente_empresa_id}
                  onChange={(e) => handleFieldChange('cliente_empresa_id', e.target.value)}
                  label="Cliente *"
                  disabled={loading}
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

              {selectedCliente && (
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom display="block">
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
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Dados do Contrato */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description color="primary" />
                Dados do Contrato
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número do Contrato"
                value={formData.numero_contrato}
                onChange={(e) => handleFieldChange('numero_contrato', e.target.value)}
                error={!!validationErrors.numero_contrato}
                helperText={validationErrors.numero_contrato || 'Deve conter exatamente 10 dígitos'}
                required
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info color="primary" />
                    <Typography variant="body2" color="primary.main">
                      <strong>Duração do Contrato:</strong> {contractDuration} dias
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<Cancel />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || loadingClientes}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          sx={{ 
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {loading ? 'Salvando...' : (mode === 'create' ? 'Criar Contrato' : 'Salvar Alterações')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

