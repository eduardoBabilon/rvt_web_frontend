export type userRole = 'central' | 'branch' | 'sales' | null;

export type LogType = 'INFO' | 'WARN' | 'ERROR';

export type User = {
  role: userRole;
  email: string;
  branch?:string;
  name: string;
  id: string;
  isAdmin: boolean;
};

export type Proposal = {
  id: string;
  branch: string | null;
  clientName: string | null;
  clientId: string | null;
  internalId: string | null;
  itemId: string | null;
  contractNumber: string | null;
  tipo_frete: string| null;
  isArt: Boolean| null;
  tipo_frete: string | null;
  info_documento: string | null;
  comercial_nome: string | null;
  createdAt: Date;
  updatedAt: Date;
  locations: Location[] | null;
};

export type TransporterLocation = {
  id: string;
  docMoveId: string | null;
  vehicleRegistrationPlate: string | null;
  transporterOrigin: 'mills' | 'cliente' | null;
  transporterCodeId: string | null;
  transporterCode: TransporterCode;
  observation: string | null;
  uf: string | null;
  departureDate: Date | null;
  modifiedDate: Date | null;
  estimatedDepartureDate: Date;
  locationId: string;
};

export type Location = {
  id: string;
  proposalId: string;
  recommendedModelId: string;
  pointedModelId: string | null;
  serieNumber: string | null;
  fleetNumber: string | null;
  status: LocationStatus | null;
  locationOrder: string;
  pointedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  invoiceId: string | null;
  proposal: Proposal;
  transporterLocation: TransporterLocation | null;
  recommendedModel: Model;
  locationLogs: LocationLog[] | null;
  invoice: Invoice | null;
};

export type Invoice = {
  id: string;
  locationId: string;
  base64: string | null;
  createdAt: Date;
  location: Location;
};

export type LocationLog = {
  id: string;
  locationId: string;
  messageId: string;
  message: string;
  title: string;
  createdAt: Date;
  type: 'INFO' | 'WARN' | 'ERROR';
};

export type TransporterCode = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LocationStatus =
  | 'AWAIT_FLEET'
  | 'AWAIT_CME'
  | 'AWAIT_TRANSPORTER'
  | 'FINISHED'
  | 'PROCESSING'
  | 'REPROCESS_NF'
  | 'ERROR';

export type Model = {
  id: string;
  name: string;
  familyId: string;
  createdAt: Date;
  updatedAt: Date;
  family: Family;
};

export type Family = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  models: ModelWithoutRelation[] | null;
};

export type SystemLog = {
  id: string;
  message: string | null;
  type: LogType;
  additionalInfo: string | null;
  action: string;
  createdAt: string;
};

logType = 'INFO' | 'WARN' | 'ERROR';


export type FleetSap = {
  id: number;
  familia: string;
  equipamento: string;
  denominacao: string;
  tipoAt: null | string;
  material: string;
}

export type Model = {
    id: string;
    name: string;
    familyId: string;
    createdAt: string;
    updatedAt: string;
}


export type Family = {
	id: string;
  name: string;
	createdAt: string;
	updatedAt: string;
}


export type Transporter = {
	id: string;
  name: string;
	createdAt: string;
	updatedAt: string;
}
