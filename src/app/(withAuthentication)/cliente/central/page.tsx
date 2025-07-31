'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Breadcrumbs,
  Link,
  TablePagination
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Business,
  Phone,
  Email,
  Home,
  CheckCircle,
  ContactPage,
  Cancel,
  MoreVert,
  CloudUpload,
  FileDownload,
  Visibility,
  Refresh
} from '@mui/icons-material';
import { 
  ClienteEmpresa,
  CreateClienteEmpresaRequest,
  formatCNPJ,
  formatTelefone
} from '@/types/modules/clienteEmpresa';
import { 
  getAllClientes, 
  deleteCliente, 
  createCliente, 
  updateCliente,
  getClientesStats
} from '@/service/api/clienteEmpresa/clienteEmpresaService';
import ClienteEmpresaModal from '@/components/RVTComponents/clienteEmpresa/ClienteEmpresaModal';
import DeleteClienteEmpresaModal from '@/components/RVTComponents/clienteEmpresa/DeleteClienteEmpresaModal';
import ImportacaoClientesModal from '@/components/RVTComponents/clienteEmpresa/ImportClientesModal';
import { useRouter } from 'next/navigation';

interface CentralClientesProps {
  userRole?: string;
}

const CentralClientes: React.FC<CentralClientesProps> = () => {
  // Estados
  const [clientes, setClientes] = useState<ClienteEmpresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados dos modais
  const [clienteModalOpen, setClienteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importacaoModalOpen, setImportacaoModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteEmpresa | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Estados do menu de ações
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuClienteId, setMenuClienteId] = useState<string | null>(null);

  // Estados das estatísticas
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    recentes: 0
  });

  const router = useRouter();

  // Carregar dados iniciais
  useEffect(() => {
    loadClientes();
    loadStats();
  }, [page, rowsPerPage, searchTerm]);

  // Função para carregar clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = searchTerm.trim()
        ? { searchTerm }
        : {};

      const response = await getAllClientes(page, rowsPerPage, filters);
      setClientes(response.content);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  // Função para carregar estatísticas
  const loadStats = async () => {
    try {
      const statsData = await getClientesStats();
      setStats({
        total: statsData.total,
        ativos: statsData.ativos,
        inativos: statsData.inativos,
        recentes: statsData.ultimosCadastrados.length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };


  //handlers de paginação
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Função para abrir modal de criação
  const handleCreateCliente = () => {
    setSelectedCliente(null);
    setModalMode('create');
    setClienteModalOpen(true);
  };

  // Função para abrir modal de edição
  const handleEditCliente = (cliente: ClienteEmpresa) => {
    setSelectedCliente(cliente);
    setModalMode('edit');
    setClienteModalOpen(true);
    handleCloseMenu();
  };

  // Função para abrir modal de exclusão
  const handleDeleteCliente = (cliente: ClienteEmpresa) => {
    setSelectedCliente(cliente);
    setDeleteModalOpen(true);
    handleCloseMenu();
  };

  // Função para salvar cliente (criar ou editar)
  const handleSaveCliente = async (data: CreateClienteEmpresaRequest) => {
    try {
      setLoading(true);
      setError(null);

      if (modalMode === 'create') {
        await createCliente(data);
        setSuccess('Cliente criado com sucesso!');
      } else if (selectedCliente) {
        await updateCliente(selectedCliente.id, data);
        setSuccess('Cliente atualizado com sucesso!');
      }

      setClienteModalOpen(false);
      await loadClientes();
      await loadStats();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      setError(error.message || 'Erro ao salvar cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCliente(id);
      setSuccess('Cliente excluído com sucesso!');
      setDeleteModalOpen(false);
      await loadClientes();
      await loadStats();
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      setError(error.message || 'Erro ao excluir cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de importação
  const handleImportacao = () => {
    setImportacaoModalOpen(true);
  };

  // Função para sucesso da importação
  const handleImportacaoSuccess = async (clientesImportados: ClienteEmpresa[]) => {
    setSuccess(`${clientesImportados.length} cliente(s) importado(s) com sucesso!`);
    setImportacaoModalOpen(false);
    await loadClientes();
    await loadStats();
  };

  // Funções do menu de ações
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, clienteId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuClienteId(clienteId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuClienteId(null);
  };

  // Função para limpar mensagens
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ContactPage sx={{ mr: 0.5 }} fontSize="inherit" />
            Central de Clientes
          </Typography>
        </Breadcrumbs>
        {/* Cabeçalho */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} mt={6}>
          <Typography variant="h4" component="h1">
            Central de Clientes
          </Typography>
          
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={handleImportacao}
              sx={{ 
                borderColor: '#ea580c', 
                color: '#ea580c',
                '&:hover': { borderColor: '#c2410c', backgroundColor: '#fed7aa',
                fontSize: '1rem'
                }
              }}
            >
              Importar Planilha
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/cliente/cadastro')}
              sx={{ 
                backgroundColor: '#ea580c',
                '&:hover': { backgroundColor: '#c2410c',
                fontSize: '1rem'
                 }
              }}
            >
              Novo Cliente
            </Button>
          </Box>
        </Box>

        {/* Mensagens de feedback */}
        {error && (
          <Alert severity="error" onClose={clearMessages} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" onClose={clearMessages} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Cards de estatísticas */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total de Clientes
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stats.total}
                    </Typography>
                  </Box>
                  <Business sx={{ fontSize: 40, color: '#ea580c' }} />
                </Box>
              </CardContent>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Clientes Ativos
                    </Typography>
                    <Typography variant="h4" component="div" color="success.main">
                      {stats.ativos}
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Clientes Inativos
                    </Typography>
                    <Typography variant="h4" component="div" color="error.main">
                      {stats.inativos}
                    </Typography>
                  </Box>
                  <Cancel sx={{ fontSize: 40, color: 'error.main' }} />
                </Box>
              </CardContent>
            </Paper>
          </Grid>
          
        </Grid>

        {/* Barra de busca e ações */}
        <Paper elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
              <TextField
                placeholder="Buscar por nome, CNPJ, email ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, maxWidth: 400 }}
              />
              
              <Box display="flex" gap={1}>
                <Tooltip title="Atualizar lista">
                  <IconButton onClick={loadClientes} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Paper>

        {/* Tabela de clientes */}
        <Paper elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Clientes Cadastrados ({clientes.length})
            </Typography>
            
            <TableContainer sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Empresa</strong></TableCell>
                    <TableCell><strong>CNPJ</strong></TableCell>
                    <TableCell><strong>Contato</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Cadastrado em</strong></TableCell>
                    <TableCell align="center"><strong>Ações</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography>Carregando...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : clientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="textSecondary">
                          {searchTerm ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente cadastrado.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientes.map((cliente) => (
                      <TableRow key={cliente.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Business fontSize="small" color="action" />
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
                          {cliente.contato_nome && (
                            <Box>
                              <Typography variant="body2">
                                {cliente.contato_nome}
                              </Typography>
                              {cliente.contato_telefone && (
                                <Typography variant="caption" color="textSecondary" display="flex" alignItems="center" gap={0.5}>
                                  <Phone fontSize="inherit" />
                                  {formatTelefone(cliente.contato_telefone)}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Email fontSize="small" color="action" />
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
                            icon={cliente.ativo ? <CheckCircle /> : <Cancel />}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(cliente.created_at)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenMenu(e, cliente.id)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginação */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
            />
            
          </CardContent>
        </Paper>

        {/* Menu de ações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => {
            const cliente = clientes.find(c => c.id === menuClienteId);
            if (cliente) handleEditCliente(cliente);
          }}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => {
            const cliente = clientes.find(c => c.id === menuClienteId);
            if (cliente) handleDeleteCliente(cliente);
          }}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Excluir</ListItemText>
          </MenuItem>
        </Menu>

        {/* Modais */}
        <ClienteEmpresaModal
          open={clienteModalOpen}
          cliente={selectedCliente}
          onClose={() => setClienteModalOpen(false)}
          onSave={handleSaveCliente}
          loading={loading}
          mode={modalMode}
        />

        <DeleteClienteEmpresaModal
          open={deleteModalOpen}
          cliente={selectedCliente}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          loading={loading}
        />

        <ImportacaoClientesModal
          open={importacaoModalOpen}
          onClose={() => setImportacaoModalOpen(false)}
          onSuccess={handleImportacaoSuccess}
        />
      </Box>
    </Box>
  );
};

export default CentralClientes;

