import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Fab,
  Grid,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  SkipNext as SkipNextIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import ObraTrechoCard from './ObraTrechoCard';
import { 
  ObraTrechoFormData,
  ObraTrechoFormErrors,
  validateObraTrecho,
  createEmptyObraTrecho,
  validateTrechosUniqueness
} from '@/types/modules/obraTrecho';

interface ObraTrechosStepProps {
  obraId?: string;
  trechos: ObraTrechoFormData[];
  onTrechosChange: (etapas: ObraTrechoFormData[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  loading?: boolean;
}

const ObraEtapasStep: React.FC<ObraTrechosStepProps> = ({
  obraId,
  trechos,
  onTrechosChange,
  onNext,
  onPrevious,
  onSkip,
  loading = false
}) => {
  
  // Estados de erro
  const [errors, setErrors] = useState<{ [index: number]: ObraTrechoFormErrors }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Validar trechos quando mudarem
  useEffect(() => {
    validateAllTrechos();
  }, [trechos]);


  const validateAllTrechos = () => {
    const newErrors: { [index: number]: ObraTrechoFormErrors } = {};
    let hasErrors = false;
    
    // Validar cada etapa individualmente
    trechos.forEach((trecho, index) => {
      if (trecho.nome_trecho || trecho.endereco) {
        // Só validar se pelo menos um campo estiver preenchido
        const trechoErrors = validateObraTrecho(trecho);
        if (Object.keys(trechoErrors).length > 0) {
          newErrors[index] = trechoErrors;
          hasErrors = true;
        }
      }
    });
    
    // Validar unicidade das etapas
    if (!validateTrechosUniqueness(trechos)) {
      setGlobalError('Não é possível ter trechos duplicadas');
      hasErrors = true;
    } else {
      setGlobalError(null);
    }
    
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleAddTrecho = () => {
    if (!obraId) {
      setGlobalError('ID da obra não encontrado');
      return;
    }
    
    const newEtapa = createEmptyObraTrecho(obraId);
    onTrechosChange([...trechos, newEtapa]);
  };

  const handleUpdateTrecho = (index: number, updatedTrecho: ObraTrechoFormData) => {
    const newTrechos = [...trechos];
    newTrechos[index] = updatedTrecho;
    onTrechosChange(newTrechos);
  };

  const handleRemoveTrecho = (index: number) => {
    const newTrechos = trechos.filter((_, i) => i !== index);
    onTrechosChange(newTrechos);
  };

  const getTrechosValidasCount = () => {
    return trechos.filter(trecho => 
      trecho.nome_trecho && trecho.endereco
    ).length;
  };

  const getTrechoComErroCount = () => {
    return Object.keys(errors).length;
  };

  const canProceed = () => {
    return getTrechoComErroCount() === 0 && !globalError;
  };

  const getTrechosExistentes = () => {
    return trechos.map(e => e.nome_trecho).filter(Boolean);
  };

  return (
    <Box>
      {/* Cabeçalho */}
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <InfoIcon sx={{ mr: 1 }} />
        Trechos da Obra
      </Typography>

      {/* Mensagens de erro global */}
      {globalError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {globalError}
        </Alert>
      )}

      {/* Lista de etapas */}
      {trechos.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum trecho adicionado
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTrecho}
              disabled={!obraId}
            >
              Adicionar Primeiro Trecho
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {trechos.map((trecho, index) => (
            <ObraTrechoCard
              key={index}
              trecho={trecho}
              index={index}
              onUpdate={handleUpdateTrecho}
              onRemove={handleRemoveTrecho}
              canRemove={trechos.length > 1}
              errors={errors[index]}
              loading={loading}
              trechosExistentes={getTrechosExistentes()}
            />
          ))}
          
          {/* Botão para adicionar mais trechos */}
          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddTrecho}
              disabled={loading || !obraId}
              size="large"
            >
              Adicionar Novo Trecho
            </Button>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default ObraEtapasStep;

