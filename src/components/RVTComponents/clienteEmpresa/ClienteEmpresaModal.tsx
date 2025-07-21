import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { Close as CloseIcon, Business, Email, Person, Phone } from '@mui/icons-material';
import { 
  ClienteEmpresa, 
  ClienteEmpresaFormData, 
  ClienteEmpresaModalProps,
  CLIENTE_EMPRESA_VALIDATION,
  CLIENTE_EMPRESA_ERROR_MESSAGES,
  formatCNPJ,
  formatTelefone
} from '@/types/modules/clienteEmpresa';
import { validateCNPJFormat } from '@/service/api/clienteEmpresa/clienteEmpresaService';

const ClienteEmpresaModal: React.FC<ClienteEmpresaModalProps> = ({
  open,
  cliente,
  onClose,
  onSave,
  loading = false,
  mode
}) => {
  const [formData, setFormData] = useState<ClienteEmpresaFormData>({
    nome_empresa: '',
    cnpj: '',
    contato_nome: '',
    contato_telefone: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Resetar formulário quando modal abrir/fechar ou cliente mudar
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && cliente) {
        setFormData({
          nome_empresa: cliente.nome_empresa || '',
          cnpj: cliente.cnpj || '',
          contato_nome: cliente.contato_nome || '',
          contato_telefone: cliente.contato_telefone || '',
          email: cliente.email || ''
        });
      } else {
        setFormData({
          nome_empresa: '',
          cnpj: '',
          contato_nome: '',
          contato_telefone: '',
          email: ''
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [open, cliente, mode]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'nome_empresa':
        if (!value.trim()) return CLIENTE_EMPRESA_ERROR_MESSAGES.NOME_EMPRESA_REQUIRED;
        if (value.trim().length < CLIENTE_EMPRESA_VALIDATION.NOME_EMPRESA.MIN_LENGTH) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.NOME_EMPRESA_MIN_LENGTH;
        }
        if (value.trim().length > CLIENTE_EMPRESA_VALIDATION.NOME_EMPRESA.MAX_LENGTH) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.NOME_EMPRESA_MAX_LENGTH;
        }
        break;

      case 'cnpj':
        if (!value.trim()) return CLIENTE_EMPRESA_ERROR_MESSAGES.CNPJ_REQUIRED;
        if (!validateCNPJFormat(value)) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.CNPJ_INVALID;
        }
        break;

      case 'contato_nome':
        if (value.trim() && value.trim().length < CLIENTE_EMPRESA_VALIDATION.CONTATO_NOME.MIN_LENGTH) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.CONTATO_NOME_MIN_LENGTH;
        }
        if (value.trim() && value.trim().length > CLIENTE_EMPRESA_VALIDATION.CONTATO_NOME.MAX_LENGTH) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.CONTATO_NOME_MAX_LENGTH;
        }
        break;

      case 'contato_telefone':
        if (value.trim() && !CLIENTE_EMPRESA_VALIDATION.CONTATO_TELEFONE.PATTERN.test(value)) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.CONTATO_TELEFONE_INVALID;
        }
        break;

      case 'email':
        if (!value.trim()) return CLIENTE_EMPRESA_ERROR_MESSAGES.EMAIL_REQUIRED;
        if (!CLIENTE_EMPRESA_VALIDATION.EMAIL.PATTERN.test(value)) {
          return CLIENTE_EMPRESA_ERROR_MESSAGES.EMAIL_INVALID;
        }
        break;

      default:
        break;
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof ClienteEmpresaFormData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (name: string, value: string) => {
    let formattedValue = value;

    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'contato_telefone') {
      formattedValue = formatTelefone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (touched[name]) {
      const error = validateField(name, formattedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name as keyof ClienteEmpresaFormData]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSave = () => {
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      onSave(formData);
    }
  };

  // Handler para fechar
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Editar Cliente' : 'Novo Cliente';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Nome da Empresa */}
          <TextField
            label="Nome da Empresa"
            value={formData.nome_empresa}
            onChange={(e) => handleFieldChange('nome_empresa', e.target.value)}
            onBlur={() => handleFieldBlur('nome_empresa')}
            error={!!errors.nome_empresa}
            helperText={errors.nome_empresa}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* CNPJ */}
          <TextField
            label="CNPJ"
            value={formData.cnpj}
            onChange={(e) => handleFieldChange('cnpj', e.target.value)}
            onBlur={() => handleFieldBlur('cnpj')}
            error={!!errors.cnpj}
            helperText={errors.cnpj || 'Formato: XX.XXX.XXX/XXXX-XX'}
            required
            fullWidth
            disabled={loading}
            placeholder="00.000.000/0000-00"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Contato Nome */}
          <TextField
            label="Nome do Contato"
            value={formData.contato_nome}
            onChange={(e) => handleFieldChange('contato_nome', e.target.value)}
            onBlur={() => handleFieldBlur('contato_nome')}
            error={!!errors.contato_nome}
            helperText={errors.contato_nome || 'Campo opcional'}
            fullWidth
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Contato Telefone */}
          <TextField
            label="Telefone do Contato"
            value={formData.contato_telefone}
            onChange={(e) => handleFieldChange('contato_telefone', e.target.value)}
            onBlur={() => handleFieldBlur('contato_telefone')}
            error={!!errors.contato_telefone}
            helperText={errors.contato_telefone || 'Campo opcional - Formato: (XX) XXXXX-XXXX'}
            fullWidth
            disabled={loading}
            placeholder="(00) 00000-0000"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Informação sobre campos obrigatórios */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Campos marcados com * são obrigatórios. 
              Os campos de contato são opcionais e podem ser preenchidos posteriormente.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          gap: 1
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            bgcolor: '#ea580c',
            '&:hover': { bgcolor: '#dc2626' },
            minWidth: 100
          }}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteEmpresaModal;