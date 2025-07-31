'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Container,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  AddCircle,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Business,
  CheckCircle,
  ContactPage,
  Home,
  Save as SaveIcon,
  SkipNext as SkipNextIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ObraDadosStep from '@/components/RVTComponents/obra/ObraDadosStep';
import ObraTrechoStep from '@/components/RVTComponents/obra/obraTrecho/ObraTrechosStep';
import { 
  Obra, 
  ObraFormData, 
  CreateObraRequest,
  cleanObraFormData,
  validateObra
} from '@/types/modules/obra';
import { 
  ObraTrechoFormData,
  CreateObraTrechoRequest,
  cleanObraTrechoFormData,
  validateObraTrecho,
  createEmptyObraTrecho
} from '@/types/modules/obraTrecho';
import { createObra } from '@/service/api/obra/obraService';
import { saveObraTrechos } from '@/service/api/obra/obraTrechoService';

const steps = [
  'Dados da Obra',
  'Trechos da Obra',
  'Confirmação dos Dados'
];

const CadastroObra: React.FC = () => {
  const router = useRouter();
  
  // Estados do stepper
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  
  // Estados dos dados
  const [obraData, setObraData] = useState<ObraFormData>({
    cliente_id: '',
    name_obra: '',
    numero_contrato: '',
    obra_tipo_id: '',
    status_obra: '',
    endereco: '',
    filial_id: '',
    data_inicio: '',
    data_fim: ''
  });
  
  const [trechosData, setTrechosData] = useState<ObraTrechoFormData[]>([]);
  const [obraCreated, setObraCreated] = useState<Obra | null>(null);
  
  // Estados de loading e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verificar se é possível avançar para o próximo step
  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0: // Dados da obra
        const obraErrors = validateObra(obraData);
        return Object.keys(obraErrors).length === 0;
      case 1: // Trechos da obra
        return true; // Trechos são opcionais
      default:
        return false;
    }
  };

  // Verificar se o step atual está completo
  const isStepComplete = (step: number) => {
    return completed[step] || false;
  };

  // Marcar step como completo
  const handleStepComplete = (step: number) => {
    setCompleted(prev => ({ ...prev, [step]: true }));
  };

  // Navegar entre steps
  const handleNext = async () => {
    let success = true;

    if (activeStep === 0) {
      // Salvar obra no backend
      success = await handleSaveObra();
      if (success) {
        handleStepComplete(0);
      }
    }

    else if (activeStep === 1) {
      // Salvar trechos no backend
      success = await handleSaveTrechos();
      if (success) {
        handleStepComplete(1);
      }
    }

    if (success) {
      setActiveStep(prev => prev + 1);
    }
  };


  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSkipTrechos = async () => {
    // Finalizar cadastro sem trechos
    await handleFinalizeCadastro();
  };

  // Salvar obra (step 1)
  const handleSaveObra = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Validação antes de salvar
      const errors = validateObra(obraData);
      if (Object.keys(errors).length > 0) {
        setError('Por favor, corrija os erros no formulário');
        return false;
      }

      const cleanedData = cleanObraFormData(obraData);

      const createdObra = await createObra(cleanedData);
      setObraCreated(createdObra);

      const trechosComObraId = trechosData.map(trecho => ({
        ...trecho,
        obra_id: createdObra.id,
      }));
      setTrechosData(trechosComObraId);

      return true;
    } catch (error: any) {
      setError('Erro ao salvar obra. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };


  // Salvar trechos (step 2)
  const handleSaveTrechos = async (): Promise<boolean> => {
    if (!obraCreated) {
      setError('Obra não foi criada. Volte ao step anterior.');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Filtrar trechos válidas (com pelo menos nome_trecho preenchido)
      const trechosValidos = trechosData.filter(trecho => 
        trecho.nome_trecho && trecho.nome_trecho.trim() !== ''
      );
      
      // Validar trechos
      const trechosComErro: number [] = [];
      for (let i = 0; i < trechosValidos.length; i++) {
        const errors = validateObraTrecho(trechosValidos[i]);
        if (Object.keys(errors).length > 0) {
          trechosComErro.push(i + 1);
        }
      }
      
      if (trechosComErro.length > 0) {
        setError(`Corrija os erros nas trechos: ${trechosComErro.join(', ')}`);
        return false;
      }
      
      // Salvar trechos
      const result = await saveObraTrechos(trechosValidos);
      
      if (result.errors.length > 0) {
        setError(`Erro ao salvar algumas trechos: ${result.errors.map(e => e.error).join(', ')}`);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('Erro ao salvar trechos:', error);
      setError('Erro ao salvar trechos. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Finalizar cadastro
  const handleFinalizeCadastro = async () => {
    let success = true;
    
    if (success) {
      setSuccess('Obra criada com sucesso!');

      setTimeout(() => {
        router.push('/obra/central');
      }, 2000);
    }
  };

  // Handlers para os steps
  const handleObraDataChange = (data: ObraFormData) => {
    setObraData(data);
  };

  const handleTrechosDataChange = (trechos: ObraTrechoFormData[]) => {
    setTrechosData(trechos);
  };

  // Renderizar conteúdo do step atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ObraDadosStep
            obraData={obraData}
            onDataChange={handleObraDataChange}
            onNext={handleNext}
            loading={loading}
          />
        );
      case 1:
        return (
          <ObraTrechoStep
            obraId={obraCreated?.id}
            trechos={trechosData}
            onTrechosChange={handleTrechosDataChange}
            onNext={handleNext}
            onPrevious={handleBack}
            onSkip={handleSkipTrechos}
            loading={loading}
          />
        );
      case 2:
        return(
          <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="h6">Confirmação dos Dados</Typography>
          </Box><Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Revise as informações antes de finalizar o cadastro:
            </Typography><Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dados da Obra
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nome:</strong> {obraData.name_obra}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Numero do Contrato:</strong> {obraData.numero_contrato}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tipo:</strong> {obraData.obra_tipo?.obra_tipo_nome}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {obraData.status_obra}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Endereço:</strong> {obraData.endereco}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Filial:</strong> {obraData.filial?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cliente:</strong> {obraData.cliente?.nome_empresa}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data de Início:</strong> {obraData.data_inicio}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data Fim:</strong> {obraData.data_fim}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                {trechosData.length > 0 ? (
                  trechosData.map((trecho, index) => (
                    <Paper key={trecho.id || index} sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Trecho {index + 1}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Nome do Trecho:</strong> {trecho.nome_trecho}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Endereço:</strong> {trecho.endereco}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum trecho cadastrada.
                  </Typography>
                )}
              </Grid>
            </Grid><Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                Dados validados! Clique em "Finalizar" para salvar a obra.
              </Typography>
            </Alert>
          </>
        )
      default:
        return null;
    }
  };

  return (
    <Box sx={{backgroundColor: '#f5f5f5'}}>
      <Box sx={{ p: 3, minHeight: '100vh', width: '90%', margin: '0 auto', textAlign: 'left' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="/home"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link 
            color="inherit" 
            href="/obra/central"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Business sx={{ mr: 0.5 }} fontSize="inherit" />
            Central de Obras
          </Link>
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <AddCircle sx={{ mr: 0.5 }} fontSize="inherit" />
            Nova Obra
          </Typography>
        </Breadcrumbs>
        {/* Cabeçalho */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Nova Obra
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cadastre uma nova obra seguindo os passos abaixo
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={isStepComplete(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Paper>

        {/* Mensagens de feedback */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Conteúdo do step atual */}
        <Paper elevation={3}>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Paper>

        {/* Navegação */}
        <Box display="flex" justifyContent="space-between" mt={3} mb={6}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/obra/central')}
          >
            Voltar para Listagem
          </Button>

          <Box display="flex" gap={2}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                disabled={loading}
              >
                Anterior
              </Button>
            )}

            {activeStep === 0 && (
              <Button
                variant="contained"
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                onClick={handleNext}
                disabled={!canProceedToNextStep() || loading}
              >
                {loading ? 'Salvando...' : 'Próximo'}
              </Button>
            )}

            {activeStep === 1 && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<SkipNextIcon />}
                  onClick={handleSkipTrechos}
                  disabled={loading}
                >
                  Pular Trechos
                </Button>
                
                <Button
                  variant="contained"
                  endIcon={loading ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                  onClick={handleNext}
                  disabled={!canProceedToNextStep() || loading}
                >
                  {loading ? 'Salvando...' : 'Próximo'}
                </Button>
              </>
            )}

            {/* Step 2: Confirmação */}
            {activeStep === 2 && (
              <Box>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleFinalizeCadastro}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Finalizar'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CadastroObra;

