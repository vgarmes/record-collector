import { Author, Grading, Record } from '@prisma/client';
import { prisma } from '../db';
import { parse } from '../utils/csv-parser';
import fs from 'fs';

const mockAuthorFile = './data/mock-data.csv';
const mockRecordFile = './data/record-mock-data.csv';
const authorFile = './data/AUTHOR_RECORD_LIST.csv';
const recordFile = './data/RECORD_COLLECTOR_BASE.csv';

interface RawAuthor {
  Nombre: string;
  'Estilo principal': string;
  Nacionalidad: string;
  'Décadas influencia': string;
  'Info contenido': string;
}

interface RawRecord {
  Record: string;
  Formato: string;
  Author: string;
  'P Year': string;
  Version: string;
  Procedencia: string;
  Label: string;
  Copy: string;
  'C Year': string;
  'Eur Price': string;
  'Price Ref': string;
  'Priced Year': string;
  Collectible: string;
  Grading: string;
  Referencia: string;
  Comments: string;
}

const mapFields: { [key in keyof RawAuthor]: string } = {
  Nombre: 'name',
  'Estilo principal': 'genre',
  Nacionalidad: 'nationality',
  'Décadas influencia': 'decadesInfluence',
  'Info contenido': 'content',
};

const parseGrading = (grading: string) => {
  switch (grading) {
    case 'MINT':
      return Grading.MINT;
    case 'EX+':
      return Grading.EXP;
    case 'EX':
      return Grading.EX;
    case 'VG':
      return Grading.VG;
    case 'GOOD':
      return Grading.GOOD;
    case 'FAIR':
      return Grading.FAIR;
    case 'POOR':
      return Grading.POOR;
    default:
      return null;
  }
};

const seedGenres = async (allAuthors: RawAuthor[]) => {
  const uniqueGenres: string[] = [];

  allAuthors.forEach((author) => {
    const genre = author['Estilo principal'] || 'N/A'; // to discard empty fields
    if (uniqueGenres.includes(genre)) return;
    uniqueGenres.push(genre);
  });

  const createdGenres = await prisma.genre.createMany({
    data: uniqueGenres.map((genre) => ({ name: genre })),
    skipDuplicates: true,
  });
  console.log('Created genres?', createdGenres);
};

const seedAuthors = async (allAuthors: RawAuthor[]) => {
  const formattedAuthors: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const stream = fs.createWriteStream('data/logfile.txt', { flags: 'a' });
  for (const author of allAuthors) {
    const genre = await prisma.genre.findUnique({
      where: { name: author['Estilo principal'] || 'N/A' },
    });

    if (!genre) {
      return stream.write(JSON.stringify(author) + '\n');
    }

    formattedAuthors.push({
      name: author.Nombre,
      genreId: genre.id,
      nationality: author.Nacionalidad,
      decadesInfluence: author['Décadas influencia'],
      content: author['Info contenido'],
    });
  }
  stream.end();

  const creation = await prisma.author.createMany({
    data: formattedAuthors,
  });

  console.log('Created authors?', creation);
};

const seedOwners = async (allRecords: RawRecord[]) => {
  const uniqueOwners: string[] = [];

  allRecords.forEach((record) => {
    if (uniqueOwners.includes(record.Procedencia)) return;
    uniqueOwners.push(record.Procedencia);
  });

  const createdOwners = await prisma.user.createMany({
    data: uniqueOwners.map((owner) => ({ name: owner })),
  });
  console.log('Created owners?', createdOwners);
};

const seedLabels = async (allRecords: RawRecord[]) => {
  const uniqueLabels: string[] = [];

  allRecords.forEach((record) => {
    if (uniqueLabels.includes(record.Label)) return;
    uniqueLabels.push(record.Label);
  });

  const createdLabels = await prisma.label.createMany({
    data: uniqueLabels.map((label) => ({ name: label })),
  });
  console.log('Created labels?', createdLabels);
};

const seedRecords = async (allRecords: RawRecord[]) => {
  const formattedRecords: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const stream = fs.createWriteStream('data/logfile.txt', { flags: 'a' });
  for (const record of allRecords) {
    console.log(record);
    const author = await prisma.author.findUnique({
      where: { name: record.Author },
    });

    const owner = await prisma.user.findUnique({
      where: { name: record.Procedencia },
    });

    const label = await prisma.label.findUnique({
      where: { name: record.Label },
    });

    if (!author || !owner || !label) {
      return stream.write(JSON.stringify(record) + '\n');
    }

    formattedRecords.push({
      title: record.Record,
      format: record.Formato,
      authorId: author.id,
      year: parseInt(record['P Year']),
      version: record.Version,
      ownerId: owner.id,
      labelId: label.id,
      copy: record.Copy,
      price: parseInt(record['Eur Price']),
      priceRef: record['Price Ref'],
      pricedYear: parseInt(record['Priced Year']),
      collectible: parseInt(record.Collectible) === 1,
      grading: parseGrading(record.Grading),
      reference: record.Referencia,
      comments: record.Comments,
    });
  }
  stream.end();

  const createdRecords = await prisma.record.createMany({
    data: formattedRecords,
  });
  console.log('Created records?', createdRecords);
};

const main = async () => {
  const allAuthors = await parse<RawAuthor>(authorFile);
  //await seedGenres(allAuthors);
  await seedAuthors(allAuthors);

  //const allRecords = await parse<RawRecord>(recordFile);
  //await seedOwners(allRecords);
  //await seedLabels(allRecords);
  //await seedRecords(allRecords);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
