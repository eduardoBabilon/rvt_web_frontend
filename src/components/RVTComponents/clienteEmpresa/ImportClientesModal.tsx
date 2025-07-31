import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Error,
  Warning,
  Delete,
  Visibility,
  FileDownload,
  Business,
  Description
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { 
  ClienteEmpresa,
  CreateClienteEmpresaRequest,
  formatCNPJ,
  validateCNPJFormat
} from '@/types/modules/clienteEmpresa';
import { createClientesLote } from '@/service/api/clienteEmpresa/clienteEmpresaService';

interface ClienteImportacao {
  linha: number;
  cnpj: string;
  nome_empresa: string;
  cnpj_formatado: string;
  status: 'valido' | 'erro' | 'duplicado' | 'processando' | 'sucesso';
  erros: string[];
  id?: string;
}

interface ImportClientesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (clientesImportados: ClienteEmpresa[]) => void;
}

const ImportClientesModal: React.FC<ImportClientesModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  // Estados
  const [activeStep, setActiveStep] = useState(0);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [clientesImportacao, setClientesImportacao] = useState<ClienteImportacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [clientesImportados, setClientesImportados] = useState<ClienteEmpresa[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuração do dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setArquivo(file);
      processarArquivo(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  // Função para processar o arquivo Excel/CSV
  const processarArquivo = async (file: File) => {
    try {
      setLoading(true);
      setErro(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Pegar a primeira planilha
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          // Processar dados
          const clientesProcessados = processarDadosPlanilha(jsonData);
          setClientesImportacao(clientesProcessados);
          setActiveStep(1);
          
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          setErro('Erro ao processar arquivo. Verifique se o formato está correto.');
        }
      };
      
      reader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      setErro('Erro ao ler arquivo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para processar dados da planilha
  const processarDadosPlanilha = (data: string[][]): ClienteImportacao[] => {
    const clientes: ClienteImportacao[] = [];
    const cnpjsEncontrados = new Set<string>();
    
    // Pular a primeira linha (cabeçalho)
    for (let i = 1; i < data.length; i++) {
      const linha = data[i];
      if (!linha || linha.length < 2) continue;
      
      const cnpjRaw = String(linha[0] || '').trim();
      const nomeEmpresa = String(linha[1] || '').trim();
      
      if (!cnpjRaw || !nomeEmpresa) continue;
      
      // Limpar CNPJ (remover formatação)
      const cnpj = cnpjRaw.replace(/\D/g, '');
      const cnpjFormatado = formatCNPJ(cnpj);
      
      const cliente: ClienteImportacao = {
        linha: i + 1,
        cnpj,
        nome_empresa: nomeEmpresa,
        cnpj_formatado: cnpjFormatado,
        status: 'valido',
        erros: []
      };
      
      // Validações
      if (cnpj.length !== 14) {
        cliente.status = 'erro';
        cliente.erros.push('CNPJ deve ter 14 dígitos');
      } else {
        const validacaoCNPJ = validateCNPJFormat(cnpj);
        if (!validacaoCNPJ.valid) {
          cliente.status = 'erro';
          cliente.erros.push(validacaoCNPJ.error || 'CNPJ inválido');
        }
      }
      
      if (nomeEmpresa.length < 2) {
        cliente.status = 'erro';
        cliente.erros.push('Nome da empresa deve ter pelo menos 2 caracteres');
      }
      
      // Verificar duplicatas na planilha
      if (cnpjsEncontrados.has(cnpj)) {
        cliente.status = 'duplicado';
        cliente.erros.push('CNPJ duplicado na planilha');
      } else {
        cnpjsEncontrados.add(cnpj);
      }
      
      clientes.push(cliente);
    }
    
    return clientes;
  };

  // Função para remover cliente da lista
  const removerCliente = (index: number) => {
    const novosClientes = [...clientesImportacao];
    novosClientes.splice(index, 1);
    setClientesImportacao(novosClientes);
  };

  // Função para importar clientes
  const importarClientes = async () => {
    try {
      setLoading(true);
      setProgresso(0);
      setErro(null);
      
      // Filtrar apenas clientes válidos
      const clientesValidos = clientesImportacao.filter(
        cliente => cliente.status === 'valido'
      );
      
      if (clientesValidos.length === 0) {
        setErro('Nenhum cliente válido para importar');
        return;
      }
      
      // Preparar dados para envio
      const dadosImportacao: CreateClienteEmpresaRequest[] = clientesValidos.map(cliente => ({
        nome_empresa: cliente.nome_empresa,
        cnpj: cliente.cnpj
      }));
      
      // Marcar como processando
      const clientesProcessando = clientesImportacao.map(cliente => 
        cliente.status === 'valido' 
          ? { ...cliente, status: 'processando' as const }
          : cliente
      );
      setClientesImportacao(clientesProcessando);
      
      // Enviar para o backend
      const resultado = await createClientesLote(dadosImportacao, (progresso) => {
        setProgresso(progresso);
      });
      
      // Atualizar status dos clientes
      const clientesFinalizados = clientesImportacao.map((cliente, index) => {
        if (cliente.status === 'processando') {
          const clienteImportado = resultado.sucessos.find(s => s.cnpj === cliente.cnpj);
          if (clienteImportado) {
            return { ...cliente, status: 'sucesso' as const, id: clienteImportado.id };
          } else {
            const erro = resultado.erros.find(e => e.cnpj === cliente.cnpj);
            return { 
              ...cliente, 
              status: 'erro' as const, 
              erros: [...cliente.erros, erro?.erro || 'Erro desconhecido']
            };
          }
        }
        return cliente;
      });
      
      setClientesImportacao(clientesFinalizados);
      setClientesImportados(resultado.sucessos);
      setActiveStep(2);
      
      // Chamar callback de sucesso
      if (resultado.sucessos.length > 0) {
        onSuccess(resultado.sucessos);
      }
      
    } catch (error: any) {
      console.error('Erro ao importar clientes:', error);
      setErro(error.message || 'Erro ao importar clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para baixar template
  const baixarTemplate = () => {
    const dados = [
      ['CNPJ Cliente', 'Cliente'],
      ['11.222.333/0001-44', 'Empresa Exemplo Ltda'],
      ['55.666.777/0001-88', 'Outra Empresa S.A.']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, 'template-importacao-clientes.xlsx');
  };

  // Função para resetar modal
  const resetarModal = () => {
    setActiveStep(0);
    setArquivo(null);
    setClientesImportacao([]);
    setLoading(false);
    setProgresso(0);
    setErro(null);
    setClientesImportados([]);
  };

  // Função para fechar modal
  const handleClose = () => {
    resetarModal();
    onClose();
  };

  // Estatísticas dos clientes
  const stats = {
    total: clientesImportacao.length,
    validos: clientesImportacao.filter(c => c.status === 'valido').length,
    erros: clientesImportacao.filter(c => c.status === 'erro' || c.status === 'duplicado').length,
    importados: clientesImportacao.filter(c => c.status === 'sucesso').length
  };

  const steps = [
    'Upload do Arquivo',
    'Validação dos Dados',
    'Importação Concluída'
  ];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <CloudUpload color="primary" />
          <Typography variant="h6">
            Importação de Clientes
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Upload do Arquivo */}
          <Step>
            <StepLabel>Upload do Arquivo</StepLabel>
            <StepContent>
              <Box mb={2}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Faça upload de uma planilha Excel (.xlsx) ou CSV com as colunas:
                    <strong> CNPJ Cliente</strong> e <strong>Cliente</strong> (Nome da Empresa)
                  </Typography>
                </Alert>
                
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  onClick={baixarTemplate}
                  sx={{ mb: 2 }}
                >
                  Baixar Template
                </Button>
              </Box>

              <Paper
                {...getRootProps()}
                sx={{
                  p: 4,
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                  textAlign: 'center',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive
                    ? 'Solte o arquivo aqui...'
                    : 'Arraste e solte o arquivo ou clique para selecionar'
                  }
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Formatos aceitos: .xlsx, .xls, .csv
                </Typography>
                
                {arquivo && (
                  <Box mt={2}>
                    <Chip
                      icon={<Description />}
                      label={arquivo.name}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Paper>

              {loading && (
                <Box mt={2}>
                  <LinearProgress />
                  <Typography variant="body2" align="center" mt={1}>
                    Processando arquivo...
                  </Typography>
                </Box>
              )}
            </StepContent>
          </Step>

          {/* Step 2: Validação dos Dados */}
          <Step>
            <StepLabel>Validação dos Dados</StepLabel>
            <StepContent>
              <Box mb={2}>
                <Typography variant="h6" gutterBottom>
                  Clientes Identificados: {stats.total}
                </Typography>
                
                <Box display="flex" gap={2} mb={2}>
                  <Chip
                    icon={<CheckCircle />}
                    label={`${stats.validos} Válidos`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Error />}
                    label={`${stats.erros} Com Erro`}
                    color="error"
                    variant="outlined"
                  />
                </Box>
              </Box>

              {clientesImportacao.length > 0 && (
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Linha</TableCell>
                        <TableCell>CNPJ</TableCell>
                        <TableCell>Nome da Empresa</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clientesImportacao.map((cliente, index) => (
                        <TableRow key={index}>
                          <TableCell>{cliente.linha}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {cliente.cnpj_formatado}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Business fontSize="small" color="action" />
                              {cliente.nome_empresa}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Chip
                                size="small"
                                icon={
                                  cliente.status === 'valido' ? <CheckCircle /> :
                                  cliente.status === 'erro' || cliente.status === 'duplicado' ? <Error /> :
                                  cliente.status === 'processando' ? <LinearProgress /> :
                                  <CheckCircle />
                                }
                                label={
                                  cliente.status === 'valido' ? 'Válido' :
                                  cliente.status === 'erro' ? 'Erro' :
                                  cliente.status === 'duplicado' ? 'Duplicado' :
                                  cliente.status === 'processando' ? 'Processando' :
                                  'Importado'
                                }
                                color={
                                  cliente.status === 'valido' || cliente.status === 'sucesso' ? 'success' :
                                  cliente.status === 'erro' || cliente.status === 'duplicado' ? 'error' :
                                  'warning'
                                }
                                variant={cliente.status === 'processando' ? 'outlined' : 'filled'}
                              />
                              {cliente.erros.length > 0 && (
                                <Box mt={1}>
                                  {cliente.erros.map((erro, i) => (
                                    <Typography key={i} variant="caption" color="error" display="block">
                                      • {erro}
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Remover da importação">
                              <IconButton
                                size="small"
                                onClick={() => removerCliente(index)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={importarClientes}
                  disabled={loading || stats.validos === 0}
                  startIcon={<CloudUpload />}
                >
                  Importar {stats.validos} Cliente(s)
                </Button>
              </Box>

              {loading && (
                <Box mt={2}>
                  <LinearProgress variant="determinate" value={progresso} />
                  <Typography variant="body2" align="center" mt={1}>
                    Importando... {Math.round(progresso)}%
                  </Typography>
                </Box>
              )}
            </StepContent>
          </Step>

          {/* Step 3: Importação Concluída */}
          <Step>
            <StepLabel>Importação Concluída</StepLabel>
            <StepContent>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Importação Concluída!
                </Typography>
                <Typography variant="body2">
                  {stats.importados} cliente(s) foram importados com sucesso.
                </Typography>
              </Alert>

              {clientesImportados.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Clientes Importados:
                  </Typography>
                  <List dense>
                    {clientesImportados.slice(0, 5).map((cliente, index) => (
                      <ListItem key={cliente.id}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={cliente.nome_empresa}
                          secondary={formatCNPJ(cliente.cnpj)}
                        />
                      </ListItem>
                    ))}
                    {clientesImportados.length > 5 && (
                      <ListItem>
                        <ListItemText
                          primary={`... e mais ${clientesImportados.length - 5} cliente(s)`}
                          sx={{ fontStyle: 'italic' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}
            </StepContent>
          </Step>
        </Stepper>

        {erro && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {erro}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {activeStep === 2 ? 'Fechar' : 'Cancelar'}
        </Button>
        {activeStep === 0 && arquivo && (
          <Button
            variant="contained"
            onClick={() => processarArquivo(arquivo)}
            disabled={loading}
          >
            Processar Arquivo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportClientesModal;

