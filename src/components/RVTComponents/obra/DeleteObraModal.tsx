import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Warning,
  Construction,
  Business,
  LocationOn,
  CalendarToday,
  Schedule,
  Person
} from '@mui/icons-material';
import { 
  DeleteObraModalProps,
  getStatusObraLabel,
  getStatusObraColor,
  formatDateForDisplay,
  calculateObraDuration
} from '@/types/modules/obra';
import { getStatusObraOptions } from '@/service/api/obra/obraService';

export const DeleteObraModal: React.FC<DeleteObraModalProps> = ({
  open,
  obra,
  onClose,
  onConfirm,
  loading = false
}) => {
  if (!obra) return null;

  const handleConfirm = () => {
    onConfirm(obra.id);
  };

  const obraDuration = calculateObraDuration(obra.data_inicio, obra.data_fim);

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
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        bgcolor: 'error.50',
        color: 'error.main',
        borderBottom: '1px solid',
        borderColor: 'error.200'
      }}>
        <Warning />
        Confirmar Exclusão de Obra
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Atenção!</strong> Esta ação não pode ser desfeita. 
            Todos os dados relacionados a esta obra serão permanentemente removidos.
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Construction color="primary" />
          Dados da Obra
        </Typography>

        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
          {/* Nome da Obra */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Nome da Obra
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {obra.name_obra}
            </Typography>
          </Box>

          {/* Numero do Contrato */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Numero do Contrato
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {obra.numero_contrato}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Informações Básicas */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Tipo de Obra
              </Typography>
              <Typography variant="body2">
                {obra.obra_tipo_nome}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Status
              </Typography>
              <Chip
                label={obra.status_obra}
                color={getStatusObraColor(obra.status_obra) as any}
                size="small"
              />
            </Box>
          </Box>

          {/* Filial */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business fontSize="small" />
              Filial
            </Typography>
            <Typography variant="body2">
              {obra.filial_nome}
            </Typography>
          </Box>

          {/* Endereço */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn fontSize="small" />
              Endereço
            </Typography>
            <Typography variant="body2">
              {obra.endereco}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Datas */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" />
                Data de Início
              </Typography>
              <Typography variant="body2">
                {formatDateForDisplay(obra.data_inicio)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule fontSize="small" />
                Data de Fim
              </Typography>
              <Typography variant="body2">
                {formatDateForDisplay(obra.data_fim)}
              </Typography>
            </Box>
          </Box>

          {/* Duração */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Duração
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight="medium">
              {obraDuration} dias
            </Typography>
          </Box>
        </Box>

        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Consequências da exclusão:</strong>
          </Typography>
          <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
            <li>A obra será removida permanentemente do sistema</li>
            <li>Todas as vinculações com fiscalizadores serão removidas</li>
            <li>Histórico e dados relacionados serão perdidos</li>
            <li>Esta ação não pode ser desfeita</li>
          </Typography>
        </Alert>

        <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
          Tem certeza de que deseja excluir esta obra?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={loading ? <CircularProgress size={20} /> : <Warning />}
          sx={{
            bgcolor: 'error.main',
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

