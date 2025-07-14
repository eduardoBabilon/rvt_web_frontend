import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';
import { User } from '@/@types/modules/users'

interface DeleteUserModalProps {
  isOpen: boolean;
  user?: User;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading = false
}) => {
  if (!user) return null;

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
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" />
            <Typography variant="h6" component="div">
              Excluir Usuário
            </Typography>
          </Box>
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
        <Typography variant="body1" gutterBottom>
          Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
        </Typography>

        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Dados do usuário:
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              <strong>Nome:</strong> {user.name}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Perfil:</strong> {user.perfilNome}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <strong>Filial:</strong> {user.filialNome}
            </Typography>
          </Box>
        </Box>
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
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Excluindo...' : 'Deletar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

