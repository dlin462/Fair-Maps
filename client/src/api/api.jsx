import axios from 'axios';

const baseUrl = 'http://localhost:8080';

export const nvBoundaries = async (url) => {
  const response = await axios.get(`${baseUrl}${url}`);
  console.log(response.data);
  return response.data;
}