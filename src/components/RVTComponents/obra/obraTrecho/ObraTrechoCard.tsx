import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Chip,
  Alert,
  Tooltip,
  TextField
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { 
  ObraTrechoFormData, 
  ObraTrechoFormErrors
} from '@/types/modules/obraTrecho';
import { EnumOption } from '@/types/modules/obra';

interface ObraTrechoCardProps {
  trecho: ObraTrechoFormData;
  index: number;
  onUpdate: (index: number, trecho: ObraTrechoFormData) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  errors?: ObraTrechoFormErrors;
  loading?: boolean;
  trechosExistentes?: string[];
}

const ObraTrechoCard: React.FC<ObraTrechoCardProps> = ({
  trecho,
  index,
  onUpdate,
  onRemove,
  canRemove,
  errors,
  loading = false,
  trechosExistentes = []
}) => {
  const handleFieldChange = (field: keyof ObraTrechoFormData, value: string) => {
    const updatedTrecho = { ...trecho, [field]: value };
    onUpdate(index, updatedTrecho);
  };

  const isTrechoComplete = () => {
    return trecho.nome_trecho && trecho.endereco;
  };

  const hasErrors = () => {
    return errors && Object.keys(errors).length > 0;
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        border: hasErrors() ? 2 : 1,
        borderColor: hasErrors() ? 'error.main' : 'divider',
        opacity: loading ? 0.7 : 1,
        position: 'relative',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      {/* Indicador de posição */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          display: 'flex',
          alignItems: 'center',
          color: 'text.secondary'
        }}
      >
        <DragIcon fontSize="small" />
        <Typography variant="caption" sx={{ ml: 0.5 }}>
          Trecho {index + 1}
        </Typography>
      </Box>

      {/* Botão de remoção */}
      {canRemove && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          <Tooltip title="Remover trecho">
            <IconButton
              size="small"
              onClick={() => onRemove(index)}
              color="error"
              disabled={loading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <CardContent sx={{ pt: 5, pb: 2 }}>
        {/* Status visual da trecho */}
        {isTrechoComplete() && (
          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={trecho.nome_trecho || 'Nome do trecho não informado'}
              color="primary"
              size="small"
            />
            <Chip
              label={trecho.endereco || 'Endereço não informado'}
              size="small"
            />
          </Box>
        )}


        {/* Alertas de erro */}
        {hasErrors() && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Corrija os erros abaixo:
            </Typography>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              {errors?.nome_trecho && <li>{errors.nome_trecho}</li>}
              {errors?.endereco && <li>{errors.endereco}</li>}
            </ul>
          </Alert>
        )}

        {/* Formulário */}
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Nome do Trecho */}
          <TextField
            fullWidth
            label="Nome do Trecho *"
            value={trecho.nome_trecho}
            onChange={(e) => handleFieldChange('nome_trecho', e.target.value)}
            error={!!errors?.nome_trecho}
            helperText={errors?.nome_trecho}
            disabled={loading}
          />

          {/* Endereço */}
          <TextField
            fullWidth
            label="Endereço *"
            value={trecho.endereco}
            onChange={(e) => handleFieldChange('endereco', e.target.value)}
            error={!!errors?.endereco}
            helperText={errors?.endereco}
            disabled={loading}
          />
        </Box>

        {/* Informações adicionais */}
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            * Campos obrigatórios
          </Typography>
          
          {trecho.nome_trecho && trechosExistentes.includes(trecho.nome_trecho) && trecho.nome_trecho !== trecho.nome_trecho && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Esta trecho já foi adicionada anteriormente
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ObraTrechoCard;

