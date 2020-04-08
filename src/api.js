import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://alpha-vantage.p.rapidapi.com',
    headers: {
        'content-type':'application/octet-stream',
        'x-rapidapi-host':'alpha-vantage.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
    }
});

export default {
    stockTimeSeries: (symbol) =>
    instance({
        'method':'GET',
        'url':'/query',
        'params': {
            'outputsize':'compact',
            'datatype':'json',
            'function':'TIME_SERIES_DAILY_ADJUSTED',
            'symbol': symbol.toUpperCase()
        },
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            console.log('Transforming data...')
    
            const json = JSON.parse(data)
    
            const dates = Object.keys(json['Time Series (Daily)']).reverse()
    
            // Construct response data for chart input
            const closePrices = dates.map(date => date = {
                date,
                close: Number(json['Time Series (Daily)'][date]['4. close'])
            })
    
            const symbol = json['Meta Data']['2. Symbol']
            const refreshed = json['Meta Data']['3. Last Refreshed']
    
            data = {
                symbol,
                refreshed,
                closePrices
            }
    
            return data;
        }],
    }),
}