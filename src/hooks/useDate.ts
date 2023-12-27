export const useDate = (type: string) => {
  const date: Date = new Date();
  if (type === 'start') {
    date.setHours(0, 0, 0, 0);
  }
  if (type === 'end') {
    date.setHours(23, 59, 59, 999);
  }
  return date;
};
