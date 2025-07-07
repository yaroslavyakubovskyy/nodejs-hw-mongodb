const parseNumber = (number, defaultValue) => {
  if (typeof number !== 'string') return defaultValue;

  const value = parseInt(number);
  if (Number.isNaN(value)) return defaultValue;
  return value;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const parsePage = parseNumber(page, 1);
  const parsePerPage = parseNumber(perPage, 10);
  return {
    page: parsePage,
    perPage: parsePerPage,
  };
};
