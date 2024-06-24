import axios from 'axios';

const baseUrl = 'http://FairMap.us-east-2.elasticbeanstalk.com';

const axiosInstance = axios.create({
  baseURL: baseUrl
});

const getNevadaPrecincts = async (state) => {
  try {
    const response = await axiosInstance.get(`/${state}`);
    const precincts = response.data
    const processedData = precincts.map(precinct => ({
      percentDemocrat: precinct.presElection.pctDemocrat,
      percentRepublican: precinct.presElection.pctRepublican,
      pctRace: {
        whitePop: precinct.demographicData.pctWhite,
        blackPop: precinct.demographicData.pctBlack,
        asianPop: precinct.demographicData.pctAsian,
        hispanicPop: precinct.demographicData.pctHispanic,
    }
    }));
    console.log(processedData);

    return processedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const postData = async (payload) => {
  try {
    const response = await axiosInstance.post('/data', payload);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// Add more request methods as needed

export { getNevadaPrecincts, postData };


// export const nvBoundaries = async (url) => {
//   const response = await axios.get(`${baseUrl}${url}`);
//   console.log(response.data);
//   return response.data;
// }

