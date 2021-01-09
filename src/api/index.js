import axios from 'axios';

const urlVaccines = 'https://api.coronavirus.data.gov.uk/v1/data?' +
            'filters=areaType=nation&areaCode=england&' +
            'structure={"date":"date","cumPeopleReceivingFirstDose":"cumPeopleReceivingFirstDose"}';

const urlDailyCases = 'https://api.coronavirus.data.gov.uk/v1/data?' +
            'filters=areaType=region&areaCode=E120000&' +
            'structure={"date":"date","newCasesByPublishDate":"newCasesByPublishDate"}';


export const fetchDataVaccines = async () => {
    try {
        const { data, status, statusText } = await axios.get(urlVaccines, { timeout: 10000 });

        if ( status >= 400 )
            throw new Error(statusText);

        return data.data;
    } catch (error) {

    }
}

export const fetchDataDailyCases = async () => {
    try {
        const { data, status, statusText } = await axios.get(urlDailyCases, { timeout: 10000 });
        console.log(data.data)
        if ( status >= 400 )
            throw new Error(statusText);
            
        return data.data;
    } catch (error) {
        
    }
}







