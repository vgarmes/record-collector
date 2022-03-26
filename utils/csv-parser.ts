import fs from 'fs';
import csv from 'csv-parser';

export function parse<T>(filePath: string): Promise<T[]> {
  const results: Array<T> = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
