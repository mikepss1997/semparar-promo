import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || 'semparar';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });

  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export interface Lead {
  _id: number;
  nrc: number;
  nome: string;
  cpf: string;
  email: string;
  celular?: string;
  placas: string;
  tags: string;
  planos: string;
  mensalidade_total?: number;
  end_cidade: string;
  end_estado: string;
  end_bairro: string;
  end_logradouro: string;
  end_numero: string;
  end_cep: string;
  situacao_conta: number;
  bdcomp?: {
    NOME?: string;
    NOME_MAE?: string;
    DATA_NASCIMENTO?: string;
    SEXO?: string;
    RENDA_ESTIMADA?: number;
  };
}
