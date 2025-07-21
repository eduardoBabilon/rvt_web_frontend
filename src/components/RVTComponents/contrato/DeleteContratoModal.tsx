import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import {
  Warning,
  Delete,
  Cancel,
  Business,
  Description,
  CalendarToday,
  Schedule
} from '@mui/icons-material';
import { 
  DeleteContratoModalProps,
  formatDateForDisplay,
  getContratoStatus,
  calculateContractDuration
} from '@/types/modules/contrato';

export const DeleteContratoModal: React.FC<DeleteContratoModalProps> = ({
  open,
  contrato,
  onClose,
  onConfirm,
  loading = false
}) => {
  if (!contrato) return null;

  const handleConfirm = () => {
    onConfirm(contrato.id);
  };

  // Obter informações do contrato
  const status = getContratoStatus(contrato.data_inicio, contrato.data_fim);
  const duracao = calculateContractDuration(contrato.data_inicio, contrato.data_fim);

  // Função para obter cor do status
  const getStatusColor = (status: 'pendente' | 'ativo' | 'finalizado') => {
    switch (status) {
      case 'ativo':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'finalizado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Função para obter label do status
  const getStatusLabel = (status: 'pendente' | 'ativo' | 'finalizado') => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'pendente':
        return 'Pendente';
      case 'finalizado':
        return 'Finalizado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          <Typography variant="h6" color="error">
            Confirmar Exclusão
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Atenção!</strong> Esta ação não pode ser desfeita. 
            O contrato será permanentemente removido do sistema.
          </Typography>
        </Alert>

        <Typography variant="body1" gutterBottom>
          Você tem certeza que deseja excluir o seguinte contrato?
        </Typography>

        {/* Informações do Contrato */}
        <Paper sx={{ p: 3, mt: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Cliente */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Cliente
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {contrato.cliente_empresa_nome}
                </Typography>
              </Box>
            </Box>

            {/* Número do Contrato */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Description color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Número do Contrato
                </Typography>
                <Typography variant="body2" fontWeight="medium" fontFamily="monospace">
                  {contrato.numero_contrato}
                </Typography>
              </Box>
            </Box>

            {/* Datas */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Data de Início
                  </Typography>
                  <Typography variant="body2">
                    {formatDateForDisplay(contrato.data_inicio)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Data de Fim
                  </Typography>
                  <Typography variant="body2">
                    {formatDateForDisplay(contrato.data_fim)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Status e Duração */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Status
                </Typography>
                <Chip
                  label={getStatusLabel(status)}
                  color={getStatusColor(status) as any}
                  size="small"
                />
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Duração
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {duracao} dias
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Aviso adicional para contratos ativos */}
        {status === 'ativo' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Contrato Ativo:</strong> Este contrato está atualmente ativo. 
              Certifique-se de que não há dependências antes de excluí-lo.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<Cancel />}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
          variant="contained"
          color="error"
          sx={{
            '&:hover': {
              bgcolor: 'error.dark'
            }
          }}
        >
          {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

