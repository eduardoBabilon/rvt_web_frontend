import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { User, UserFormData, UserFormErrors, Perfil, Filial } from '@/types/modules/users';
import { perfilService } from '@/service/api/users/perfilService';
import { filialService } from '@/service/api/users/filialService';

interface UserModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  user?: User;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  loading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  mode,
  user,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    username: '',
    perfilId: '',
    filialId: '',
    ativo: true,
  });

  const [errors, setErrors] = useState<UserFormErrors>({});
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  
  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        perfilId: '', 
        filialId: '', 
        ativo: user.ativo
      });
    } else {
      setFormData({
        name: '',
        email: '',
        username: '',
        perfilId: '',
        filialId: '',
        ativo: true
      });
    }
    setErrors({});
    setApiError('');
  }, [mode, user, isOpen]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      setApiError('');
      
      const [perfisResponse, filiaisResponse] = await Promise.all([
        perfilService.getAllPerfis(),
        filialService.getAllFiliais()
      ]);

      setPerfis(perfisResponse.data);
      setFiliais(filiaisResponse.data);

      if (mode === 'edit' && user) {
        const perfilEncontrado = perfisResponse.data.find(p => p.perfil === user.perfilNome);
        const filialEncontrada = filiaisResponse.data.find(f => f.name === user.filialNome);

        setFormData(prev => ({
          ...prev,
          perfilId: perfilEncontrado?.id || '',
          filialId: filialEncontrada?.id || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      setApiError('Erro ao carregar opções. Tente novamente.');
    } finally {
      setLoadingOptions(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: UserFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username é obrigatório';
    }

    if (!formData.perfilId) {
      newErrors.perfilId = 'Função é obrigatória';
    }

    if (!formData.filialId) {
      newErrors.filialId = 'Filial é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof UserFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {mode === 'create' ? 'Adicionar Usuário' : 'Editar Usuário'}
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        {loadingOptions ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={32} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Carregando opções...
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading}
              required
              sx={{ mb: 2 }}
            />

            <FormControl 
              fullWidth 
              error={!!errors.perfilId}
              disabled={loading}
              required
              sx={{ mb: 2 }}
            >
              <InputLabel>Função</InputLabel>
              <Select
                value={formData.perfilId}
                label="Função"
                onChange={(e) => handleInputChange('perfilId', e.target.value)}
              >
                {perfis.map((perfil) => (
                  <MenuItem key={perfil.id} value={perfil.id}>
                    {perfil.perfil}
                  </MenuItem>
                ))}
              </Select>
              {errors.perfilId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.perfilId}
                </Typography>
              )}
            </FormControl>

            <FormControl 
              fullWidth 
              error={!!errors.filialId}
              disabled={loading}
              required
              sx={{ mb: 2 }}
            >
              <InputLabel>Filial</InputLabel>
              <Select
                value={formData.filialId}
                label="Filial"
                onChange={(e) => handleInputChange('filialId', e.target.value)}
              >
                {filiais.map((filial) => (
                  <MenuItem key={filial.id} value={filial.id}>
                    {filial.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.filialId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.filialId}
                </Typography>
              )}
            </FormControl>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          color="primary"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || loadingOptions}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
