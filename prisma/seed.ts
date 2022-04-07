import { Grading, Record } from '@prisma/client';
import { prisma } from '../db';
import { parse } from '../utils/csv-parser';

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
    case 'EXP':
      return Grading.EXP;
    case 'EX':
      return Grading.VG;
    default:
      return null;
  }
};

const seedGenres = async (allAuthors: RawAuthor[]) => {
  const uniqueGenres: string[] = [];

  allAuthors.forEach((author) => {
    if (uniqueGenres.includes(author['Estilo principal'])) return;
    uniqueGenres.push(author['Estilo principal']);
  });

  const createdGenres = await prisma.genre.createMany({
    data: uniqueGenres.map((genre) => ({ name: genre })),
  });
  console.log('Created genres?', createdGenres);
};

const seedAuthors = async (allAuthors: RawAuthor[]) => {
  const genres = await prisma.genre.findMany();

  const formattedAuthors = allAuthors.map((author) => {
    const genreId = genres.find(
      (genre) => genre.name === author['Estilo principal']
    )!.id;

    return {
      name: author.Nombre,
      genreId,
      nationality: author.Nacionalidad,
      decadesInfluence: author['Décadas influencia'],
      content: author['Info contenido'],
    };
  });

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
  for (const record of allRecords) {
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
      return;
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

  const createdRecords = await prisma.record.createMany({
    data: formattedRecords,
  });
  console.log('Created labels?', createdRecords);
};

const main = async () => {
  const allAuthors = await parse<RawAuthor>('./data/mock-data.csv');
  await seedGenres(allAuthors);
  await seedAuthors(allAuthors);

  const allRecords = await parse<RawRecord>('./data/record-mock-data.csv');
  await seedOwners(allRecords);
  seedLabels(allRecords);
  await seedRecords(allRecords);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
