export function groupBy<T, K extends keyof T>(records: T[], groupField: K) {
  return records.reduce((aggregate, record) => {
    const index = aggregate.findIndex((r) => r.id === record[groupField]);
    if (index > -1) {
      aggregate[index].data.push(record);
      return aggregate;
    } else {
      aggregate.push({
        id: record[groupField],
        data: [record],
      });
      return aggregate;
    }
  }, [] as Array<{ id: T[K]; data: T[] }>);
}
