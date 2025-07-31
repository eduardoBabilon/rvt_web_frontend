import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Obra, EnumOption } from '@/types/modules/obra';
import { ObraTrecho} from '@/types/modules/obraTrecho';
import { getObraTrechosByObraId } from '@/service/api/obra/obraTrechoService';

interface ObraCardProps {
  obra: Obra;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTrecho: (id: string) => void;
  statusOptions: EnumOption[];
  userRole: string;
}

const ObraCard: React.FC<ObraCardProps> = ({
  obra,
  onEdit,
  onDelete,
  onAddTrecho,
  statusOptions,
  userRole
}) => {
  const [expanded, setExpanded] = useState(false);
  const [trechos, setTrechos] = useState<ObraTrecho[]>([]);
  const [loadingTrechos, setLoadingTrechos] = useState(false);
  const [errorTrechos, setErrorTrechos] = useState<string | null>(null);
  const [trechosLoaded, setTrechosLoaded] = useState(false);

  // Verificar permissões
  const isAdmin = userRole === 'ADMINISTRADOR';
  const canEdit = isAdmin; // Apenas admin pode editar/excluir obras
  const canAddTrecho = true; // Todos podem adicionar trechos

  // Carregar trechos quando o accordion é expandido
  useEffect(() => {
    if (expanded && !trechosLoaded) {
      loadTrechos();
    }
  }, [expanded, trechosLoaded]);

  const loadTrechos = async () => {
    try {
      setLoadingTrechos(true);
      setErrorTrechos(null);
      
      const trechosData = await getObraTrechosByObraId(obra.id);
      setTrechos(trechosData);
      setTrechosLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar trechos da obra:', error);
      setErrorTrechos('Erro ao carregar trechos');
      setTrechos([]);
    } finally {
      setLoadingTrechos(false);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatDateTime = (dateTime: string | Date | null | undefined): string => {
    if (!dateTime) return 'Não definido';
    
    try {
      const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'MOBILIZANDO':
        return '#f59e0b';
      case 'EM_ANDAMENTO':
        return '#10b981';
      case 'DESMOBILIZACAO':
        return '#f97316';
      case 'CONCLUIDA':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string): string => {
    const option = statusOptions.find(opt => opt.name === status);
    return option?.label || status;
  };

  const getTrechoStatusColor = (status: string): string => {
    switch (status) {
      case 'PENDENTE':
        return '#6b7280';
      case 'EM_ANDAMENTO':
        return '#f59e0b';
      case 'CONCLUIDA':
        return '#10b981';
      case 'CANCELADA':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getComplexidadeColor = (complexidade: string): string => {
    switch (complexidade) {
      case 'BAIXA':
        return '#10b981';
      case 'MEDIA':
        return '#f59e0b';
      case 'ALTA':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              {obra.name_obra}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
              <Chip
                label={getStatusLabel(obra.status_obra)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(obra.status_obra),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              {obra.obra_tipo_nome && (
                <Chip
                  label={obra.obra_tipo_nome}
                  size="small"
                  variant="outlined"
                />
              )}
              {obra.filial_nome && (
                <Chip
                  label={obra.filial_nome}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
            </Box>
          </Box>
          
          <Box display="flex" gap={1}>
            {canAddTrecho && (
              <Tooltip title="Adicionar Trecho">
                <IconButton
                  onClick={() => onAddTrecho(obra.id)}
                  size="small"
                  sx={{ color: '#ea580c' }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            {canEdit && (
              <Tooltip title="Editar Obra">
                <IconButton
                  onClick={() => onEdit(obra.id)}
                  size="small"
                  sx={{ color: '#ea580c' }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {canEdit && (
              <Tooltip title="Excluir Obra">
                <IconButton
                  onClick={() => onDelete(obra.id)}
                  size="small"
                  sx={{ color: '#d32f2f' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Cliente: {obra.cliente_name}
              </Typography>
            </Box>
            
            {obra.numero_contrato && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AssignmentIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Contrato: {obra.numero_contrato}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                {obra.endereco}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Início: {formatDateTime(obra.data_inicio)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Accordion para Trechos */}
        <Accordion 
          expanded={expanded} 
          onChange={handleExpandClick}
          sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: '#f5f5f5' }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                Trechos da Obra
              </Typography>
              {trechosLoaded && (
                <Chip
                  label={`${trechos.length} trecho${trechos.length !== 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </AccordionSummary>
          
          <AccordionDetails>
            {loadingTrechos ? (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            ) : errorTrechos ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorTrechos}
                <Button 
                  size="small" 
                  onClick={loadTrechos}
                  sx={{ ml: 1 }}
                >
                  Tentar Novamente
                </Button>
              </Alert>
            ) : trechos.length === 0 ? (
              <Box textAlign="center" py={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Nenhuma trecho cadastrada para esta obra.
                </Typography>
                {canAddTrecho && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => onAddTrecho(obra.id)}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Adicionar Primeira Trecho
                  </Button>
                )}
              </Box>
            ) : (
              <List dense>
                {trechos.map((trecho, index) => (
                  <React.Fragment key={trecho.id || index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" flexDirection="column" alignItems="start" gap={0.5} flexWrap="wrap">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {trecho.nome_trecho || 'Trecho sem nome'}
                            </Typography>
                            <Typography variant="subtitle2">
                              {trecho.endereco || 'N/A'}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Criada em: {formatDateTime(trecho.created_at)}
                            </Typography>
                            {trecho.updated_at && trecho.updated_at !== trecho.created_at && (
                              <Typography variant="body2" color="textSecondary">
                                Atualizada em: {formatDateTime(trecho.updated_at)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < trechos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                
                {/* Botão para adicionar mais trechos */}
                {canAddTrecho && (
                  <ListItem sx={{ px: 0, pt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => onAddTrecho(obra.id)}
                      size="small"
                      fullWidth
                    >
                      Adicionar Nova Trecho
                    </Button>
                  </ListItem>
                )}
              </List>
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ObraCard;

