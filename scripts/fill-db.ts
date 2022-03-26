import { prisma } from '../db';
import { parse } from '../utils/csv-parser';

interface Author {
  Nombre: string;
  'Estilo principal': string;
  Nacionalidad: string;
  'Décadas influencia': string;
  'Info contenido': string;
}

const mapFields: { [key in keyof Author]: string } = {
  Nombre: 'name',
  'Estilo principal': 'genre',
  Nacionalidad: 'nationality',
  'Décadas influencia': 'decadesInfluence',
  'Info contenido': 'content',
};

const backfillAuthors = async () => {
  const allAuthors = await parse<Author>('./data/mock-data.csv');
  console.log(allAuthors);
};

backfillAuthors();
