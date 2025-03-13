export const getDateKey = () => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date.toISOString().split('T')[0];
  };
  