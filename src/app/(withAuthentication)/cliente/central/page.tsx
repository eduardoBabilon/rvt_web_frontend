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
  Business,
  Email,
  Phone,
  Person
} from '@mui/icons-material';
import { 
  ClienteEmpresa, 
  ClienteEmpresaFormData, 
  ClienteEmpresaFilters,
  CentralClientesProps 
} from '@/types/modules/clienteEmpresa';
import { 
  getAllClientes, 
  getClientesWithFilters, 
  createCliente, 
  updateCliente, 
  deleteCliente,
  getClientesStats,
  cleanClienteEmpresaFormData
} from '@/service/api/clienteEmpresa/clienteEmpresaService';
import  ClienteEmpresaModal  from '@/components/RVTComponents/clienteEmpresa/ClienteEmpresaModal';
import  DeleteClienteEmpresaModal  from '@/components/RVTComponents/clienteEmpresa/DeleteClienteEmpresaModal';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: string;
  direction: SortDirection;
}

export default function CentralClientes(){
  const [clientes, setClientes] = useState<ClienteEmpresa[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'nome_empresa', direction: 'asc' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados para modais
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteEmpresa | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Estados para estatísticas
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0
  });

  // Função para carregar clientes
  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const clientesData = await getAllClientes();
      setClientes(clientesData);
      setFilteredClientes(clientesData);
      
      // Carregar estatísticas
      const statsData = await getClientesStats();
      setStats({
        total: statsData.total,
        ativos: statsData.ativos,
        inativos: statsData.inativos
      });
      
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar lista de clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Função para aplicar filtros e busca
  const applyFilters = useCallback(async () => {
    try {
      const filters: ClienteEmpresaFilters = {};
      
      if (searchTerm.trim()) {
        // Verificar se é busca por CNPJ, email ou nome
        if (searchTerm.includes('@')) {
          filters.email = searchTerm.trim();
        } else if (searchTerm.replace(/\D/g, '').length >= 11) {
          filters.cnpj = searchTerm.replace(/\D/g, '');
        } else {
          filters.nome_empresa = searchTerm.trim();
        }
      }

      const sortString = `${sortConfig.field},${sortConfig.direction}`;
      const filtered = await getClientesWithFilters(filters, page, rowsPerPage, sortString);
      setFilteredClientes(filtered);
      
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err);
      setError('Erro ao filtrar clientes. Tente novamente.');
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
    setSelectedCliente(null);
    setModalMode('create');
    setModalOpen(true);
  };

  // Função para abrir modal de edição
  const handleEdit = (cliente: ClienteEmpresa) => {
    setSelectedCliente(cliente);
    setModalMode('edit');
    setModalOpen(true);
  };

  // Função para abrir modal de exclusão
  const handleDelete = (cliente: ClienteEmpresa) => {
    setSelectedCliente(cliente);
    setDeleteModalOpen(true);
  };

  // Função para salvar cliente (criar ou editar)
  const handleSave = async (formData: ClienteEmpresaFormData) => {
    try {
      setActionLoading(true);
      setError(null);

      const cleanData = cleanClienteEmpresaFormData(formData);

      if (modalMode === 'create') {
        await createCliente(cleanData);
        setSuccess('Cliente criado com sucesso!');
      } else if (selectedCliente) {
        await updateCliente(selectedCliente.id, cleanData);
        setSuccess('Cliente atualizado com sucesso!');
      }

      setModalOpen(false);
      setSelectedCliente(null);
      await loadClientes();
      
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', err);
      
      // Tratar erros específicos do backend
      if (err.message?.includes('CNPJ já cadastrado')) {
        setError('CNPJ já está cadastrado para outro cliente.');
      } else if (err.message?.includes('Email já cadastrado')) {
        setError('Email já está cadastrado para outro cliente.');
      } else {
        setError('Erro ao salvar cliente. Verifique os dados e tente novamente.');
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

      await deleteCliente(id);
      setSuccess('Cliente excluído com sucesso!');
      setDeleteModalOpen(false);
      setSelectedCliente(null);
      await loadClientes();
      
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError('Erro ao excluir cliente. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  // Função para fechar alertas
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Função para formatar CNPJ
  const formatCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length !== 14) return cnpj;
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Função para formatar telefone
  const formatTelefone = (telefone: string) => {
    if (!telefone) return '-';
    const numbers = telefone.replace(/\D/g, '');
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular dados paginados
  const paginatedClientes = filteredClientes.slice(
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
          Central de Clientes
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
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total de Clientes
            </Typography>
            <Typography variant="h4" component="div">
              {stats.total}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Clientes Ativos
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {stats.ativos}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Clientes Inativos
            </Typography>
            <Typography variant="h4" component="div" color="error.main">
              {stats.inativos}
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
            placeholder="Buscar por nome, CNPJ ou email..."
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
            Novo Cliente
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
                  active={sortConfig.field === 'nome_empresa'}
                  direction={sortConfig.field === 'nome_empresa' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('nome_empresa')}
                >
                  Nome da Empresa
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'cnpj'}
                  direction={sortConfig.field === 'cnpj' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('cnpj')}
                >
                  CNPJ
                </TableSortLabel>
              </TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'email'}
                  direction={sortConfig.field === 'email' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.field === 'criado_em'}
                  direction={sortConfig.field === 'criado_em' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('criado_em')}
                >
                  Criado em
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClientes.map((cliente) => (
              <TableRow key={cliente.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business color="action" />
                    <Typography variant="body2" fontWeight="medium">
                      {cliente.nome_empresa}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {formatCNPJ(cliente.cnpj)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {cliente.contato_nome ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person color="action" />
                      <Typography variant="body2">
                        {cliente.contato_nome}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {cliente.contato_telefone ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone color="action" />
                      <Typography variant="body2">
                        {formatTelefone(cliente.contato_telefone)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email color="action" />
                    <Typography variant="body2">
                      {cliente.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={cliente.ativo ? 'Ativo' : 'Inativo'}
                    color={cliente.ativo ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(cliente.created_at)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar cliente">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(cliente)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir cliente">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(cliente)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {paginatedClientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    {searchTerm ? 'Nenhum cliente encontrado com os filtros aplicados.' : 'Nenhum cliente cadastrado.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredClientes.length}
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
      <ClienteEmpresaModal
        open={modalOpen}
        cliente={selectedCliente}
        onClose={() => {
          setModalOpen(false);
          setSelectedCliente(null);
        }}
        onSave={handleSave}
        loading={actionLoading}
        mode={modalMode}
      />

      <DeleteClienteEmpresaModal
        open={deleteModalOpen}
        cliente={selectedCliente}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCliente(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </Box>
  );
};