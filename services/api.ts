export const fetchProperties = async (page = 1) => {
  const response = await fetch(`https://xulifestyle.com/api/auth/property/?page=${page}`);
  const json = await response.json();
  return json;
};
