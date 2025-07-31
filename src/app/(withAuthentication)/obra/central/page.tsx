'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Pagination,
  Fab,
  Container,
  Paper,
  Breadcrumbs,
  Link,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add,
  ContactPage,
  Home,
  Business,
  Search
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ObraCard from '@/components/RVTComponents/obra/ObraCard';
import { DeleteObraModal } from '@/components/RVTComponents/obra/DeleteObraModal';
import { Obra, ObraFilters, ObraPagedResponse, EnumOption } from '@/types/modules/obra';
import {
  getAllObras,
  getObrasStats,
  getStatusObraOptions,
  getFilialOptions,
  getObraTipoOptions,
  deleteObra
} from '@/service/api/obra/obraService';

// Simulação de contexto de usuário - implementar conforme sistema de auth
const useUserContext = () => {
  return {
    user: {
      id: '48fc72d0-837e-45c0-b5d9-51c909afa3ee',
      perfil: 'ADMINISTRADOR', // ADMIN, FISCALIZADOR_SUPERVISOR, FISCALIZADOR_LIDER_DE_MONTAGEM
      name: 'josé Babilon'
    }
  };
};

const ListagemObras: React.FC = () => {
  const router = useRouter();
  const { user } = useUserContext();
  
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);
  
  const [filters, setFilters] = useState<ObraFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filialFilter, setFilialFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  
  const [statusOptions, setStatusOptions] = useState<EnumOption[]>([]);
  const [filialOptions, setFilialOptions] = useState<Array<{id: string, name: string}>>([]);
  const [tipoOptions, setTipoOptions] = useState<Array<{id: string, tipo: string}>>([]);
  
  const [stats, setStats] = useState({
    total: 0,
    mobilizando: 0,
    em_andamento: 0,
    desmobilizacao: 0,
    concluida: 0,
    recentes: 0
  });
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [obraToDelete, setObraToDelete] = useState<Obra | null>(null);

  const isAdmin = user.perfil === 'ADMINISTRADOR';
  const isFiscalizador = user.perfil === 'FISCALIZADOR_SUPERVISOR' || user.perfil === 'FISCALIZADOR_LIDER_DE_MONTAGEM';

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadObras();
  }, [currentPage, filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [statusOptionsData, filialOptionsData, tipoOptionsData, statsData] = await Promise.all([
        getStatusObraOptions(),
        getFilialOptions(),
        getObraTipoOptions(),
        getObrasStats(isFiscalizador ? user.id : undefined)
      ]);
      
      setStatusOptions(statusOptionsData);
      setFilialOptions(filialOptionsData);
      setTipoOptions(tipoOptionsData);
      setStats(statsData);
      
      await loadObras();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadObras = async () => {
    try {
      setError(null);

      let response: ObraPagedResponse;
      response = await getAllObras();
      
      setObras(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
      setError('Erro ao carregar obras. Tente novamente.');
      setObras([]);
    }
  };

  const handleSearch = () => {
    const newFilters: ObraFilters = {};
    
    if (searchTerm.trim()) {
      newFilters.name_obra = searchTerm.trim();
    }

    if (searchTerm.trim()) {
      newFilters.numero_contrato = searchTerm.trim();
    }
    
    if (statusFilter) {
      newFilters.status_obra = statusFilter;
    }
    
    if (filialFilter) {
      newFilters.filial_id = filialFilter;
    }
    
    if (tipoFilter) {
      newFilters.obra_tipo_id = tipoFilter;
    }
    
    setFilters(newFilters);
    setCurrentPage(0); 
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFilialFilter('');
    setTipoFilter('');
    setFilters({});
    setCurrentPage(0);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1); // Material-UI usa 1-based, backend usa 0-based
  };

  const handleRefresh = async () => {
    await loadObras();
    const newStats = await getObrasStats(isFiscalizador ? user.id : undefined);
    setStats(newStats);
  };

  const handleDeleteObra = (obra: Obra) => {
    setObraToDelete(obra);
    setDeleteModalOpen(true);
  };

  const confirmDeleteObra = async () => {
    if (!obraToDelete) return;
    
    try {
      await deleteObra(obraToDelete.id);
      setDeleteModalOpen(false);
      setObraToDelete(null);
      
      // Recarregar dados
      await loadObras();
      const newStats = await getObrasStats(isFiscalizador ? user.id : undefined);
      setStats(newStats);
      
      // Se a página atual ficou vazia e não é a primeira, voltar uma página
      if (obras.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Erro ao excluir obra:', error);
      setError('Erro ao excluir obra. Tente novamente.');
    }
  };

  const handleAddTrecho = (obraId: string) => {
    router.push(`/obra/${obraId}/editar?step=trechos`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, minHeight: '100vh'}}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{backgroundColor: '#f5f5f5'}}>
      <Box sx={{ p: 3, width: '90%', margin: '0 auto', textAlign: 'left' }}>
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
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Business sx={{ mr: 0.5 }} fontSize="inherit" />
            Central de Obras
          </Typography>
        </Breadcrumbs>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mt={6}>
          <Typography variant="h4" component="h1">
            {isAdmin ? 'Central de Obras' : 'Minhas Obras'}
          </Typography>
          <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/obra/cadastro')}
              sx={{ 
                bgcolor: '#ea580c',
                fontSize: '1rem',          // aumenta o texto
                px: 3,                     // padding horizontal (largura)
                py: 0.5,                   // padding vertical (altura)
                '&:hover': { bgcolor: '#c2410c' }
              }}
            >
              Nova Obra
            </Button>
        </Box>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Cards de Estatísticas */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Paper elevation={3} sx={{ minWidth: 160 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total de Obras
              </Typography>
              <Typography variant="h5" component="div" color="#ea580c">
                {stats.total}
              </Typography>
            </CardContent>
          </Paper>
          <Paper elevation={3} sx={{ minWidth: 160 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Mobilizando
              </Typography>
              <Typography variant="h5" component="div" color="#f59e0b">
                {stats.mobilizando}
              </Typography>
            </CardContent>
          </Paper>
          <Paper elevation={3} sx={{ minWidth: 160 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Em Andamento
              </Typography>
              <Typography variant="h5" component="div" color="#10b981">
                {stats.em_andamento}
              </Typography>
            </CardContent>
          </Paper>
          <Paper elevation={3} sx={{ minWidth: 160 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Desmobilização
              </Typography>
              <Typography variant="h5" component="div" color="#f97316">
                {stats.desmobilizacao}
              </Typography>
            </CardContent>
          </Paper>
          <Paper elevation={3} sx={{ minWidth: 160 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Concluídas
              </Typography>
              <Typography variant="h5" component="div" color="#6b7280">
                {stats.concluida}
              </Typography>
            </CardContent>
          </Paper>
        </Box>

        {/* Filtros */}
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              placeholder="Buscar por nome da obra ou número do contrato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2.5}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2.5}>
            <FormControl size="small" fullWidth>
              <InputLabel>Filial</InputLabel>
              <Select
                value={filialFilter}
                onChange={(e) => setFilialFilter(e.target.value)}
                label="Filial"
              >
                <MenuItem value="">Todas</MenuItem>
                {filialOptions.map((filial) => (
                  <MenuItem key={filial.id} value={filial.id}>
                    {filial.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                {tipoOptions.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.tipo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Botões */}
          <Grid item xs={12} mt={1}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#ea580c', '&:hover': { backgroundColor: '#dc2626' } }}
              >
                Buscar
              </Button>
              <Button variant="outlined" onClick={handleClearFilters} size="small">
                Limpar
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Chips de filtros ativos */}
        {(filters.name_obra || filters.numero_contrato || filters.status_obra || filters.filial_id || filters.obra_tipo_id) && (
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            {filters.name_obra && (
              <Chip
                label={`Nome: ${filters.name_obra}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters.name_obra;
                  setFilters(newFilters);
                  setSearchTerm('');
                }}
                size="small"
              />
            )}
            {filters.numero_contrato && (
              <Chip
                label={`Contrato: ${filters.numero_contrato}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters.numero_contrato;
                  setFilters(newFilters);
                  setSearchTerm('');
                }}
                size="small"
              />
            )}
            {filters.status_obra && (
              <Chip
                label={`Status: ${statusOptions.find(s => s.name === filters.status_obra)?.label || filters.status_obra}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters.status_obra;
                  setFilters(newFilters);
                  setStatusFilter('');
                }}
                size="small"
              />
            )}
            {filters.filial_id && (
              <Chip
                label={`Filial: ${filialOptions.find(f => f.id === filters.filial_id)?.name || 'Selecionada'}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters.filial_id;
                  setFilters(newFilters);
                  setFilialFilter('');
                }}
                size="small"
              />
            )}
            {filters.obra_tipo_id && (
              <Chip
                label={`Tipo: ${tipoOptions.find(t => t.id === filters.obra_tipo_id)?.tipo || 'Selecionado'}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters.obra_tipo_id;
                  setFilters(newFilters);
                  setTipoFilter('');
                }}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>


        {/* Lista de Obras */}
        <Box>
          {obras.length === 0 ? (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                {isAdmin ? 'Nenhuma obra encontrada.' : 'Você não possui obras vinculadas.'}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {obras.map((obra) => (
                <Grid item xs={12} key={obra.id}>
                  <ObraCard
                    obra={obra}
                    onEdit={(id) => router.push(`/obra/${id}/editar`)}
                    onDelete={() => handleDeleteObra(obra)}
                    onAddTrecho={() => handleAddTrecho(obra.id)}
                    statusOptions={statusOptions}
                    userRole={user.perfil}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Paginação */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Modal de Exclusão */}
        <DeleteObraModal
          open={deleteModalOpen}
          obra={obraToDelete}
          onClose={() => {
            setDeleteModalOpen(false);
            setObraToDelete(null);
          }}
          onConfirm={confirmDeleteObra}
        />
      </Box>
    </Box> 

  );
};

export default ListagemObras;

