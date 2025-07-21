import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Warning as WarningIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DeleteClienteEmpresaModalProps } from '@/types/modules/clienteEmpresa';

/**
 * Modal de confirmação para exclusão de cliente
 * Segue o padrão de UI da tela de usuários com Material UI
 */
const DeleteClienteEmpresaModal: React.FC<DeleteClienteEmpresaModalProps> = ({
  open,
  cliente,
  onClose,
  onConfirm,
  loading = false
}) => {
  const handleConfirm = () => {
    if (cliente) {
      onConfirm(cliente.id);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!cliente) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Excluir Cliente
          </Typography>
        </Box>
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
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Atenção!</strong> Esta ação não pode ser desfeita. 
            O cliente será permanentemente removido do sistema.
          </Typography>
        </Alert>

        {/* Informações do Cliente */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            bgcolor: 'grey.50'
          }}
        >
          {/* Nome da Empresa */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <BusinessIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Nome da Empresa
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.nome_empresa}
              </Typography>
            </Box>
          </Box>

          {/* CNPJ */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <BusinessIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                CNPJ
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.cnpj}
              </Typography>
            </Box>
          </Box>

          {/* Email */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EmailIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {cliente.email}
              </Typography>
            </Box>
          </Box>

          {/* Contato Nome (se existir) */}
          {cliente.contato_nome && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PersonIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Contato
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {cliente.contato_nome}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Contato Telefone (se existir) */}
          {cliente.contato_telefone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Telefone
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {cliente.contato_telefone}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Chip
              label={cliente.ativo ? 'Ativo' : 'Inativo'}
              color={cliente.ativo ? 'success' : 'default'}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </Box>

        {/* Aviso adicional */}
        <Alert severity="warning" sx={{ mt: 3, mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'error.dark', fontWeight: 500 }}>
            <strong>Importante:</strong> Verifique se este cliente não possui contratos ou obras associadas 
            antes de prosseguir com a exclusão.
          </Typography>
        </Alert>
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
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 100
          }}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <WarningIcon />}
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteClienteEmpresaModal;