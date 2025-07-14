export const apiRoutes = {
  getCurrentUser: {
    method: 'GET',
    uri: '/users',
    listenHeaders: ['Authorization'],
  },

  //RVT ROUTES

  ////Users
  createUser: {
    method: 'POST',
    uri: '/users',
    listeHeaders: ['Authorization'],
  },

  getAllUsers: {
    method: 'GET',
    uri: '/users',
    listeHeaders: ['Authorization'],
  },
  
  getUserById: {
    method: 'GET',
    uri: '/users/{id}',
    listeHeaders: ['Authorization'],
  },

  getUserByEmail: {
    method: 'GET',
    uri: '/users/email/{email}',
    listeHeaders: ['Authorization'],
  },

  getUserByUsername: {
    method: 'GET',
    uri: '/users/username/{username}',
    listeHeaders: ['Authorization'],
  },

  updateUser: {
    method: 'PUT',
    uri: '/users/{id}',
    listeHeaders: ['Authorization'],
  },

  deleteUser: {
    method: 'DELETE',
    uri: '/users/{id}',
    listeHeaders: ['Authorization'],
  },

  ////Filiais
  getAllFiliais: {
    method: 'GET',
    uri: '/filias',
    listeHeaders: ['Authorization'],
  },

  getFilialById: {
    method: 'GET',
    uri: '/filiais/{id}',
    listeHeaders: ['Authorization'],
  },

  getActiveFiliais: {
    method: 'GET',
    uri: '/filiais?ativo=true',
    listeHeaders: ['Authorization'],
  },

  ////Users_Perfil
  getAllPerfis: {
    method: 'GET',
    uri: '/perfis',
    listeHeaders: ['Authorization'],
  },

  getPerfilId: {
    method: 'GET',
    uri: '/perfis/{id}',
    listeHeaders: ['Authorization'],
  },

  getActivePerfis: {
    method: 'GET',
    uri: '/perfis?ativo=true',
    listeHeaders: ['Authorization'],
  },

  ////Cliente
  createCliente: {
    method: 'POST',
    uri: '/clientes',
    listeHeaders: ['Authorization'],
  },

  getAllClientes: {
    method: 'GET',
    uri: '/clientes',
    listeHeaders: ['Authorization'],
  },

  getClienteById: {
    method: 'GET',
    uri: '/clientes/{id}',
    listeHeaders: ['Authorization'],
  },

  updateCliente: {
    method: 'PUT',
    uri: '/clientes/{id}',
    listeHeaders: ['Authorization'],
  },

  deleteCliente: {
    method: 'DELETE',
    uri: '/clientes/{id}',
    listeHeaders: ['Authorization'],
  },

  ////Contratos
  createContrato: {
    method: 'POST',
    uri: '/contratos',
    listeHeaders: ['Authorization'],
  },

  getAllContratos: {
    method: 'GET',
    uri: '/contratos',
    listeHeaders: ['Authorization'],
  },

  getContratoById: {
    method: 'GET',
    uri: '/contratos/{id}',
    listeHeaders: ['Authorization'],
  },

  getContratoByCliente: {
    method: 'GET',
    uri: '/contratos/cliente/{clienteId}',
    listeHeaders: ['Authorization'],
  },

  updateContrato: {
    method: 'PUT',
    uri: '/contratos/{id}',
    listeHeaders: ['Authorization'],
  },

  deleteContrato: {
    method: 'DELETE',
    uri: '/contratos/{id}',
    listeHeaders: ['Authorization'],
  },

  ////Obras
  createObra: {
    method: 'POST',
    uri: '/obras',
    listeHeaders: ['Authorization'],
  },

  getAllObras: {
    method: 'GET',
    uri: '/obras',
    listeHeaders: ['Authorization'],
  },

  getObraById: {
    method: 'GET',
    uri: '/obras/{id}',
    listeHeaders: ['Authorization'],
  },

  getObraByFilial: {
    method: 'GET',
    uri: '/obras/filial/{filialId}',
    listeHeaders: ['Authorization'],
  },

  updateObra: {
    method: 'PUT',
    uri: '/obras/{id}',
    listeHeaders: ['Authorization'],
  },

  deleteObra: {
    method: 'DELETE',
    uri: '/obras/{id}',
    listeHeaders: ['Authorization'],
  },

  ////Etapas de Obras
  createObraEtapa: {
    method: 'POST',
    uri: '/obra-etapas',
    listeHeaders: ['Authorization'],
  },

  getAllObraEtapas: {
    method: 'GET',
    uri: '/obra-etapas',
    listeHeaders: ['Authorization'],
  },

  getObraEtapaById: {
    method: 'GET',
    uri: '/obra-etapas/{id}',
    listeHeaders: ['Authorization'],
  },

  getObraEtapaByObra: {
    method: 'GET',
    uri: '/obra-ertapas/obra/{obraId}',
    listeHeaders: ['Authorization'],
  },

  updateObraEtapa: {
    method: 'PUT',
    uri: '/obra-etapas/{id}',
    listeHeaders: ['Authorization'],
  },

  deleteObraEtapa: {
    method: 'DELETE',
    uri: '/obra-etapas/{id}',
    listeHeaders: ['Authorization'],
  },

  // MCC ROUTES

  getAllBU: {
    method: 'GET',
    uri: '/bu/all',
    listenHeaders: ['Authorization'],
  },

  getAllFamilia: {
    method: 'GET',
    uri: '/familia/all',
    listenHeaders: ['Authorization'],
  },

  getAllFrota: {
    method: 'GET',
    uri: '/frota/all',
    listenHeaders: ['Authorization'],
  },

  getAllModelo: {
    method: 'GET',
    uri: '/modelo/all',
    listenHeaders: ['Authorization'],
  },

  createFrota: {
    method: 'POST',
    uri: '/frota/save',
    listenHeaders: ['Authorization'],
  },

  createModelo: {
    method: 'POST',
    uri: '/modelo/save',
    listenHeaders: ['Authorization'],
  },

  createFamilia: {
    method: 'POST',
    uri: '/familia/save',
    listenHeaders: ['Authorization'],
  },

  createBU: {
    method: 'POST',
    uri: '/bu/save',
    listenHeaders: ['Authorization'],
  },

  createInfoTecnica: {
    method: 'POST',
    uri: '/informacaoTecnica/save',
    listenHeaders: ['Authorization'],
  },

  createModeloInfoTecnica: {
    method: 'POST',
    uri: '/modeloInformacaoTecnica/save',
    listenHeaders: ['Authorization'],
  },

  updateFrota: {
    method: 'PUT',
    uri: '/frota/update/:id',
    listenHeaders: ['Authorization'],
  },

  updateModelo: {
    method: 'PUT',
    uri: '/modelo/update/:id',
    listenHeaders: ['Authorization'],
  },

  updateFamilia: {
    method: 'PUT',
    uri: '/familia/update/:id',
    listenHeaders: ['Authorization'],
  },

  updateBU: {
    method: 'PUT',
    uri: '/bu/update/:id',
    listenHeaders: ['Authorization'],
  },

  getAllManyBU: {
    method: 'GET',
    uri: '/bu/allMany',
    listenHeaders: ['Authorization'],
  },

  getAllManyFamilia: {
    method: 'GET',
    uri: '/familia/allMany',
    listenHeaders: ['Authorization'],
  },

  getAllManyModelo: {
    method: 'GET',
    uri: '/modelo/allMany',
    listenHeaders: ['Authorization'],
  },

  getAllInfoTecnica: {
    method: 'GET',
    uri: '/informacaoTecnica/all',
    listenHeaders: ['Authorization'],
  },

  getAllModeloInfoTecnica: {
    method: 'GET',
    uri: '/modeloInformacaoTecnica/all',
    listenHeaders: ['Authorization'],
  },

  deleteBu: {
    method: 'DELETE',
    uri: '/bu/delete/:id',
    listenHeaders: ['Authorization'],
  },

  deleteFrota: {
    method: 'DELETE',
    uri: '/frota/delete/:id',
    listenHeaders: ['Authorization'],
  },

  deleteFamilia: {
    method: 'DELETE',
    uri: '/familia/delete/:id',
    listenHeaders: ['Authorization'],
  },

  deleteModelo: {
    method: 'DELETE',
    uri: '/modelo/delete/:id',
    listenHeaders: ['Authorization'],
  },

  updateModeloInfoTecnica: {
    method: 'PUT',
    uri: '/modeloInformacaoTecnica/update/:id',
    listenHeaders: ['Authorization'],
  },

  updateInfoTecnica: {
    method: 'PUT',
    uri: '/informacaoTecnica/update/:id',
    listenHeaders: ['Authorization'],
  },

  deleteModeloInfoTenica: {
    method: 'DELETE',
    uri: '/modeloInformacaoTecnica/delete/:id',
    listenHeaders: ['Authorization'],
  },

  deleteInfoTenica: {
    method: 'DELETE',
    uri: '/informacaoTecnica/delete/:id',
    listenHeaders: ['Authorization'],
  },
 
  getAllManyInfoTecnica: {
    method: 'GET',
    uri: '/informacaoTecnica/allMany',
    listenHeaders: ['Authorization'],
  },

  getAllFotoModelo: {
    method: 'GET',
    uri: '/fotoModelo/all',
    listenHeaders: ['Authorization'],
  },

  createFotoModelo: {
    method: 'POST',
    uri: '/fotoModelo/save',
    listenHeaders: ['Authorization'],
  },

  deleteFotoModelo: {
    method: 'DELETE',
    uri: '/fotoModelo/delete/:id',
    listenHeaders: ['Authorization'],
  },

  getAllCompleteFamilia: {
    method: 'GET',
    uri: '/familia/allFullObject',
    listenHeaders: ['Authorization'],
  },

  getAllCompleteFrota: {
    method: 'GET',
    uri: '/frota/allFullObject',
    listenHeaders: ['Authorization'],
  },

  getAllCompleteModelo: {
    method: 'GET',
    uri: '/modelo/allFullObject',
    listenHeaders: ['Authorization'],
  },

};
