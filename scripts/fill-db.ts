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

const backfillGenres = async () => {
  const allAuthors = await parse<Author>('./data/mock-data.csv');

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

const backfillAuthors = async () => {
  const allAuthors = await parse<Author>('./data/mock-data.csv');

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

//backfillGenres();
backfillAuthors();
