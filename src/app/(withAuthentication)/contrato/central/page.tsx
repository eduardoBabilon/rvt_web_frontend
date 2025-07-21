'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Description,
  Business,
  CalendarToday,
  Schedule
} from '@mui/icons-material';
import { 
  Contrato, 
  ContratoFormData, 
  ContratoFilters,
  CentralContratosProps,
  formatDateForDisplay,
  formatDateTimeForDisplay,
  getContratoStatus,
  calculateContractDuration,
  cleanContratoFormData
} from '@/types/modules/contrato';
import { 
  getAllContratos, 
  getContratosWithFilters, 
  createContrato, 
  updateContrato, 
  deleteContrato,
  getContratosStats
} from '@/service/api/contrato/contratoService';
import { ContratoModal } from '@/components/RVTComponents/contrato/ContratoModal';
import { DeleteContratoModal } from '@/components/RVTComponents/contrato/DeleteContratoModal';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: string;
  direction: SortDirection;
}

export default function CentralContratos(){
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [filteredContratos, setFilteredContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'numero_contrato', direction: 'asc' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para modais
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Estados para estatísticas
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    pendentes: 0,
    finalizados: 0
  });

  // Função para carregar contratos
  const loadContratos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const contratosData = await getAllContratos();
      setContratos(contratosData);
      setFilteredContratos(contratosData);
      
      // Carregar estatísticas
      const statsData = await getContratosStats();
      setStats({
        total: statsData.total,
        ativos: statsData.ativos,
        pendentes: statsData.pendentes,
        finalizados: statsData.finalizados
      });
      
    } catch (err) {
      console.error('Erro ao carregar contratos:', err);
      setError('Erro ao carregar lista de contratos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    loadContratos();
  }, [loadContratos]);

  // Função para aplicar filtros e busca
  const applyFilters = useCallback(async () => {
    try {
      const filters: ContratoFilters = {};
      
      if (searchTerm.trim()) {
        // Verificar se é busca por número do contrato ou nome do cliente
        if (/^\d+$/.test(searchTerm.trim())) {
          filters.numero_contrato = searchTerm.trim();
        } else {
          filters.cliente_empresa_nome = searchTerm.trim();
        }
      }

      const sortString = `${sortConfig.field},${sortConfig.direction}`;
      const filtered = await getContratosWithFilters(filters, page, rowsPerPage, sortString);
      setFilteredContratos(filtered);
      
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err);
      setError('Erro ao filtrar contratos. Tente novamente.');
    }
  }, [searchTerm, sortConfig, page, rowsPerPage]);

  // Aplicar filtros quando houver mudanças
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  // Função para ordenação
  const handleSort = (field: string) => {
    const newDirection: SortDirection = 
      sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    setSortConfig({ field, direction: newDirection });
  };

  // Função para mudança de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Função para mudança de linhas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Função para abrir modal de criação
  const handleCreate = () => {
    setSelectedContrato(null);
    setModalMode('create');
    setModalOpen(true);
  };

  // Função para abrir modal de edição
  const handleEdit = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Função para abrir modal de exclusão
  const handleDelete = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setDeleteModalOpen(true);
  };

  // Função para salvar contrato (criar ou editar)
  const handleSave = async (formData: ContratoFormData) => {
    try {
      setActionLoading(true);
      setError(null);

      const cleanData = cleanContratoFormData(formData);

      if (modalMode === 'create') {
        await createContrato(cleanData);
        setSuccess('Contrato criado com sucesso!');
      } else if (selectedContrato) {
        await updateContrato(selectedContrato.id, cleanData);
        setSuccess('Contrato atualizado com sucesso!');
      }

      setModalOpen(false);
      setSelectedContrato(null);
      await loadContratos();
      
    } catch (err: any) {
      console.error('Erro ao salvar contrato:', err);
      
      // Tratar erros específicos do backend
      if (err.message?.includes('Número do contrato já cadastrado')) {
        setError('Número do contrato já está cadastrado.');
      } else if (err.message?.includes('Cliente não encontrado')) {
        setError('Cliente selecionado não foi encontrado.');
      } else {
        setError('Erro ao salvar contrato. Verifique os dados e tente novamente.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);

      await deleteContrato(id);
      setSuccess('Contrato excluído com sucesso!');
      setDeleteModalOpen(false);
      setSelectedContrato(null);
      await loadContratos();
      
    } catch (err) {
      console.error('Erro ao excluir contrato:', err);
      setError('Erro ao excluir contrato. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Função para fechar alertas
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

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

  // Calcular dados paginados
  const paginatedContratos = filteredContratos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Central de Contratos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie todos os contratos cadastrados no sistema
        </Typography>
      </Box>

      {/* Alertas */}
      {error && (
        <Alert severity="error" onClose={handleCloseAlert} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={handleCloseAlert} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Cards de Estatísticas */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total de Contratos
            </Typography>
            <Typography variant="h4" component="div">
              {stats.total}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Contratos Ativos
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {stats.ativos}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Contratos Pendentes
            </Typography>
            <Typography variant="h4" component="div" color="warning.main">
              {stats.pendentes}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Contratos Finalizados
            </Typography>
            <Typography variant="h4" component="div" color="error.main">
              {stats.finalizados}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Controles */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <TextField
            placeholder="Buscar por número do contrato ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Novo Contrato
          </Button>
        </Box>
      </Paper>

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'cliente_empresa_nome'}
                  direction={sortConfig.field === 'cliente_empresa_nome' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('cliente_empresa_nome')}
                >
                  Cliente
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'numero_contrato'}
                  direction={sortConfig.field === 'numero_contrato' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('numero_contrato')}
                >
                  Número do Contrato
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'data_inicio'}
                  direction={sortConfig.field === 'data_inicio' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('data_inicio')}
                >
                  Data de Início
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'data_fim'}
                  direction={sortConfig.field === 'data_fim' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('data_fim')}
                >
                  Data de Fim
                </TableSortLabel>
              </TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContratos.map((contrato) => {
              const status = getContratoStatus(contrato.data_inicio, contrato.data_fim);
              const duracao = calculateContractDuration(contrato.data_inicio, contrato.data_fim);
              
              return (
                <TableRow key={contrato.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Business color="action" />
                      <Typography variant="body2" fontWeight="medium">
                        {contrato.cliente_empresa_nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description color="action" />
                      <Typography variant="body2" fontFamily="monospace" fontWeight="medium">
                        {contrato.numero_contrato}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday color="action" />
                      <Typography variant="body2">
                        {formatDateForDisplay(contrato.data_inicio)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule color="action" />
                      <Typography variant="body2">
                        {formatDateForDisplay(contrato.data_fim)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {duracao} dias
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(status)}
                      color={getStatusColor(status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar contrato">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(contrato)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir contrato">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(contrato)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginatedContratos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    {searchTerm ? 'Nenhum contrato encontrado com os filtros aplicados.' : 'Nenhum contrato cadastrado.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredContratos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </TableContainer>

      {/* Modais */}
      <ContratoModal
        open={modalOpen}
        contrato={selectedContrato}
        onClose={() => {
          setModalOpen(false);
          setSelectedContrato(null);
        }}
        onSave={handleSave}
        loading={actionLoading}
        mode={modalMode}
      />

      <DeleteContratoModal
        open={deleteModalOpen}
        contrato={selectedContrato}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedContrato(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </Box>
  );
};

