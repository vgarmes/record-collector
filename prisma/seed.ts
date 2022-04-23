import { Author, Record, Role } from '@prisma/client';
import { prisma } from '../server/prisma';
import { parse } from '../utils/csv-parser';
import fs from 'fs';
import { hashPassword } from '../utils/auth';

const authorFile = './data/AUTHOR_RECORD_LIST.csv';
const recordFile = './data/RECORD_LIST.csv';

interface RawAuthor {
  Nombre: string;
  'Estilo principal': string;
  Nacionalidad: string;
  'Décadas influencia': string;
  'Info contenido': string;
}

interface RawRecord {
  'Id Record': string;
  Record: string;
  Formato: string;
  Author: string;
  'P Year': string;
  Version: string;
  Procedencia: string;
  Label: string;
}

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
    if (uniqueOwners.includes(record.Procedencia.toLowerCase())) return;
    uniqueOwners.push(record.Procedencia.toLowerCase());
  });

  const owners = await Promise.all(
    uniqueOwners.map(async (owner) => ({
      name: owner,
      password: await hashPassword('admin123'),
      role: Role.ADMIN,
    }))
  );

  const createdOwners = await prisma.user.createMany({
    data: owners,
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
  //await deleteAllRecords();
  let formattedRecords: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const stream = fs.createWriteStream('data/logfile.txt', { flags: 'a' });
  const admin = await prisma.user.findUnique({ where: { name: 'j' } });
  if (!admin) {
    throw new Error('no fallback user available');
  }
  const BATCH_SIZE = 100;
  let i = 0;
  for (const record of allRecords) {
    console.log('inserting: ', record['Id Record']);
    const author = await prisma.author.findUnique({
      where: { name: record.Author },
    });

    const owner = await prisma.user.findUnique({
      where: { name: record.Procedencia.toLowerCase() },
    });

    const label = await prisma.label.findUnique({
      where: { name: record.Label },
    });

    if (!author || !label) {
      stream.write(JSON.stringify(record) + '\n');
      continue;
    }

    formattedRecords.push({
      title: record.Record,
      format: record.Formato,
      authorId: author.id,
      year: parseInt(record['P Year']) || null,
      version: record.Version,
      ownerId: owner?.id || admin.id,
      labelId: label.id,
    });
    if (i === BATCH_SIZE - 1) {
      await prisma.record.createMany({
        data: formattedRecords,
      });
      formattedRecords = [];
      i = 0;
    } else {
      i += 1;
    }
  }
  stream.end();

  // insert the rest
  await prisma.record.createMany({
    data: formattedRecords,
  });
};

const deleteAllRecords = async () => {
  await prisma.record.deleteMany({});
};

const main = async () => {
  const allAuthors = await parse<RawAuthor>(authorFile);
  await seedGenres(allAuthors);
  await seedAuthors(allAuthors);

  const allRecords = await parse<RawRecord>(recordFile);
  await seedOwners(allRecords);
  await seedLabels(allRecords);
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
