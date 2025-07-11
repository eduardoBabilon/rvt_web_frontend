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
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { User, UserFormData, UserFilters, PaginationParams, UserPagedResponse } from '@/@types/modules/users';
import { userService } from '@/service/users/userService';
import { UserModal } from '@/components/RVTComponents/users/UsersModal';
import { DeleteUserModal } from '@/components/RVTComponents/users/DeleteUsersModal';

type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: string;
  direction: SortDirection;
}

export default function Page (){
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'nome', direction: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<string>('');

  // Estados dos modais
  const [userModal, setUserModal] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit',
    user: undefined as User | undefined
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: undefined as User | undefined
  });

  // Debounce para busca
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  // Carregar usuários
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const filters: UserFilters = {};
      if (searchTerm.trim()) {
        filters.nome = searchTerm.trim();
      }

      const pagination: PaginationParams = {
        page,
        size: rowsPerPage,
        sort: `${sortConfig.field},${sortConfig.direction}`
      };

      const response: UserPagedResponse = await userService.getAllUsers(filters, pagination);
      
      setUsers(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, rowsPerPage, sortConfig]);

  // Carregar usuários na inicialização e quando dependências mudarem
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Debounce para busca
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      setPage(0); // Reset para primeira página ao buscar
      loadUsers();
    }, 500);

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);

  // Handlers para ordenação
  const handleSort = (field: string) => {
    const newDirection: SortDirection = 
      sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    setSortConfig({ field, direction: newDirection });
    setPage(0); // Reset para primeira página ao ordenar
  };

  // Handlers para paginação
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers para modais
  const handleOpenCreateModal = () => {
    setUserModal({ isOpen: true, mode: 'create', user: undefined });
  };

  const handleOpenEditModal = (user: User) => {
    setUserModal({ isOpen: true, mode: 'edit', user });
  };

  const handleOpenDeleteModal = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleCloseModals = () => {
    setUserModal({ isOpen: false, mode: 'create', user: undefined });
    setDeleteModal({ isOpen: false, user: undefined });
  };

  // Handlers para CRUD
  const handleCreateUser = async (userData: UserFormData) => {
    try {
      setActionLoading(true);
      await userService.createUser(userData);
      handleCloseModals();
      loadUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setError('Erro ao criar usuário. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    if (!userModal.user) return;

    try {
      setActionLoading(true);
      await userService.updateUser(userModal.user.id, userData);
      handleCloseModals();
      loadUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError('Erro ao atualizar usuário. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    try {
      setActionLoading(true);
      await userService.deleteUser(deleteModal.user.id);
      handleCloseModals();
      loadUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setError('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitModal = (userData: UserFormData) => {
    if (userModal.mode === 'create') {
      handleCreateUser(userData);
    } else {
      handleUpdateUser(userData);
    }
  };

  // Função para renderizar ícone de ordenação
  const renderSortIcon = (field: string) => {
    if (sortConfig.field !== field) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Central de Usuários
        </Typography>
      </Box>

      {/* Barra de busca e botão novo */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <TextField
              placeholder="Buscar usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, maxWidth: 400 }}
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
              onClick={handleOpenCreateModal}
              sx={{ 
                bgcolor: '#ea580c',
                '&:hover': { bgcolor: '#c2410c' }
              }}
            >
              Novo Registro
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Mensagem de erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabela */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'id'}
                    direction={sortConfig.field === 'id' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    ID
                    {renderSortIcon('id')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'nome'}
                    direction={sortConfig.field === 'nome' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('nome')}
                  >
                    Nome
                    {renderSortIcon('nome')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'email'}
                    direction={sortConfig.field === 'email' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('email')}
                  >
                    Email
                    {renderSortIcon('email')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Função</TableCell>
                <TableCell>Filial</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'criadoEm'}
                    direction={sortConfig.field === 'criadoEm' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('criadoEm')}
                  >
                    Criado em
                    {renderSortIcon('criadoEm')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'atualizadoEm'}
                    direction={sortConfig.field === 'atualizadoEm' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('atualizadoEm')}
                  >
                    Atualizado em
                    {renderSortIcon('atualizadoEm')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Carregando usuários...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum usuário encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {user.id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.funcao}</TableCell>
                    <TableCell>{user.filial}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.admin ? 'Sim' : 'Não'} 
                        size="small"
                        color={user.admin ? 'primary' : 'default'}
                        variant={user.admin ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.atualizadoEm).toLocaleDateString('pt-BR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditModal(user)}
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteModal(user)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
      </Paper>

      {/* Modais */}
      <UserModal
        isOpen={userModal.isOpen}
        mode={userModal.mode}
        user={userModal.user}
        onClose={handleCloseModals}
        onSubmit={handleSubmitModal}
        loading={actionLoading}
      />

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        user={deleteModal.user}
        onClose={handleCloseModals}
        onConfirm={handleDeleteUser}
        loading={actionLoading}
      />
    </Box>
  );
};

