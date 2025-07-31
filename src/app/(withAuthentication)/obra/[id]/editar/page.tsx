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
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  Home as HomeIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import ObraDadosStep from '@/components/RVTComponents/obra/ObraDadosStep';
import ObraTrechosStep from '@/components/RVTComponents/obra/obraTrecho/ObraTrechosStep';
import { 
  Obra, 
  ObraFormData, 
  UpdateObraRequest,
  cleanObraFormData,
  validateObra,
  convertObraToFormData
} from '@/types/modules/obra';
import { 
  ObraTrechoFormData,
  CreateObraTrechoRequest,
  convertObraTrechoToFormData,
  createEmptyObraTrecho
} from '@/types/modules/obraTrecho';
import { 
  getObraById, 
  updateObra 
} from '@/service/api/obra/obraService';
import { 
  getObraTrechosByObraId,
  saveObraTrechos,
  updateObraTrecho,
  deleteObraTrecho
} from '@/service/api/obra/obraTrechoService';

const steps = [
  'Dados da Obra',
  'Trechos da Obra'
];

const EdicaoObra: React.FC = () => {

  const router = useRouter();

  const params = useParams();
  const id = params.id;

  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  const trecho = searchParams.get('trecho');
  
  // Estados do stepper
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  
  // Estados dos dados
  const [obra, setObra] = useState<Obra | null>(null);
  const [obraData, setObraData] = useState<ObraFormData>({
    name_obra: '',
    numero_contrato: '',
    obra_tipo_id: '',
    status_obra: '',
    endereco: '',
    cliente_id: '',
    filial_id: '',
    data_inicio: '',
    data_fim: ''
  });
  
  const [trechosData, setTrechosData] = useState<ObraTrechoFormData[]>([]);
  const [trechosOriginais, setTrechosOriginais] = useState<ObraTrechoFormData[]>([]);
  
  // Estados de loading e erro
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar dados da obra
  useEffect(() => {
    if (id) {
      loadObraData();
    }
  }, [id]);

  // Definir step inicial baseado na query
  useEffect(() => {
    if (step === 'trechos') {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [step]);

  // Carregar trechos quando ir para step 2
  useEffect(() => {
    if (activeStep === 1 && obra && trechosData.length === 0) {
      loadTrechosData();
    }
  }, [activeStep, obra]);

  const loadObraData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const obraData = await getObraById(id as string);
      setObra(obraData);
      
      // Converter para formato do formulário
      const formData = convertObraToFormData(obraData);
      setObraData(formData);
      
      // Marcar step 1 como completo se dados estão válidos
      const errors = validateObra(formData);
      if (Object.keys(errors).length === 0) {
        setCompleted(prev => ({ ...prev, 0: true }));
      }
      
    } catch (error) {
      console.error('Erro ao carregar obra:', error);
      setError('Erro ao carregar dados da obra');
    } finally {
      setLoading(false);
    }
  };

  const loadTrechosData = async () => {
    if (!obra) return;
    
    try {
      const trechos = await getObraTrechosByObraId(obra.id);
      const trechosFormData = trechos.map(convertObraTrechoToFormData);
      
      setTrechosData(trechosFormData);
      setTrechosOriginais([...trechosFormData]);
      
      // Se não há trechos, adicionar uma vazia
      if (trechosFormData.length === 0) {
        const trechoVazia = createEmptyObraTrecho(obra.id);
        setTrechosData([trechoVazia]);
      }
      
    } catch (error) {
      console.error('Erro ao carregar trechos:', error);
      setError('Erro ao carregar trechos da obra');
    }
  };

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
    if (activeStep === 0) {
      // Salvar obra antes de ir para trechos
      const success = await handleSaveObra();
      if (success) {
        handleStepComplete(0);
        setActiveStep(prev => prev + 1);
        // Atualizar URL
        router.replace(`/obra/${id}/editar?step=trechos`);
      }
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    // Atualizar URL
    if (activeStep === 1) {
      router.replace(`/obra/${id}/editar`);
    }
  };

  // Salvar obra (step 1)
  const handleSaveObra = async (): Promise<boolean> => {
    if (!obra) return false;
    
    try {
      setSaving(true);
      setError(null);
      
      // Validar dados
      const errors = validateObra(obraData);
      if (Object.keys(errors).length > 0) {
        setError('Por favor, corrija os erros no formulário');
        return false;
      }
      
      // Limpar e preparar dados
      const cleanedData = cleanObraFormData(obraData);
      
      // Atualizar obra
      const updatedObra = await updateObra(obra.id, cleanedData);
      setObra(updatedObra);
      
      setSuccess('Dados da obra atualizados com sucesso!');
      return true;
      
    } catch (error) {
      console.error('Erro ao atualizar obra:', error);
      setError('Erro ao atualizar obra. Tente novamente.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Salvar trechos (step 2)
  const handleSaveTrechos = async (): Promise<boolean> => {
    if (!obra) {
      setError('Obra não encontrada');
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Filtrar trechos válidas
      const trechosValidas = trechosData.filter(trecho => 
        trecho.nome_trecho && trecho.nome_trecho.trim() !== ''
      );
      
      // Identificar trechos novas, atualizadas e removidas
      const trechosNovas = trechosValidas.filter(trecho => !trecho.id);
      const trechosAtualizadas = trechosValidas.filter(trecho => trecho.id);
      const trechosRemovidas = trechosOriginais.filter(original => 
        !trechosValidas.some(atual => atual.id === original.id)
      );
      
      // Processar remoções
      for (const trecho of trechosRemovidas) {
        if (trecho.id) {
          await deleteObraTrecho(trecho.id);
        }
      }
      
      // Processar atualizações
      for (const trecho of trechosAtualizadas) {
        if (trecho.id) {
          await updateObraTrecho(trecho.id, {
            nome_trecho: trecho.nome_trecho,
            endereco: trecho.endereco
          });
        }
      }
      
      // Processar criações
      if (trechosNovas.length > 0) {
        await saveObraTrechos(trechosNovas);
      }
      
      // Recarregar trechos
      await loadTrechosData();
      
      setSuccess(`Trechos atualizadas com sucesso! (${trechosValidas.length} trecho(s))`);
      return true;
      
    } catch (error) {
      console.error('Erro ao salvar trechos:', error);
      setError('Erro ao salvar trechos. Tente novamente.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Finalizar edição
  const handleFinalizarEdicao = async () => {
    let success = true;
    
    // Se estamos no step de trechos, salvar trechos
    if (activeStep === 1) {
      success = await handleSaveTrechos();
    }
    
    if (success) {
      // Redirecionar para listagem
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
            loading={saving}
          />
        );
      case 1:
        return (
          <ObraTrechosStep
            obraId={obra?.id}
            trechos={trechosData}
            onTrechosChange={handleTrechosDataChange}
            onNext={handleFinalizarEdicao}
            onPrevious={handleBack}
            onSkip={handleFinalizarEdicao}
            loading={saving}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Carregando dados da obra...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!obra) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 3 }}>
        <Container maxWidth="lg">
          <Alert severity="error">
            Obra não encontrada
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="/obra/central"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Obras
          </Link>
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <BusinessIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {obra.name_obra}
          </Typography>
        </Breadcrumbs>

        {/* Cabeçalho */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Editar Obra
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {obra.name_obra}
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={isStepComplete(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

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
        <Card>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

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
                disabled={saving}
              >
                Anterior
              </Button>
            )}

            {activeStep === 0 && (
              <Button
                variant="contained"
                endIcon={saving ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                onClick={handleNext}
                disabled={!canProceedToNextStep() || saving}
              >
                {saving ? 'Salvando...' : 'Próximo'}
              </Button>
            )}

            {activeStep === 1 && (
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleFinalizarEdicao}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EdicaoObra;

