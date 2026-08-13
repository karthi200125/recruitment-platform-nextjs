
let key = 'TlU0bnNRUlRQT0E5VHQ3dDRQakFrNzQzRGFpSmthZ3lvWU03cklEYw==';
let baseUrl = process.env.GET_OPTIONS_DATA_BASE_URL || 'https://api.countrystatecity.in/v1';

const apiCache: { [key: string]: any } = {
    countries: null,
    countriesTime: 0,
    states: null,
    statesTime: 0,
};

interface Country {
    name: string;
}
interface State {
    name: string;
}

const CACHE_DURATION = 1000 * 60 * 60;

export const getCountries = async () => {
    try {
        if (apiCache.countries && Date.now() - apiCache.countriesTime < CACHE_DURATION) {
            return apiCache.countries;
        }

        const url = `${baseUrl}/countries`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "X-CSCAPI-KEY": key,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        apiCache.countries = data;
        apiCache.countriesTime = Date.now();
        return data;
    } catch (err) {
        console.error('Error fetching countries:', err);
        return [];
    }
};

export const getStates = async () => {
    try {
        // Return cached if fresh
        if (apiCache.states && Date.now() - apiCache.statesTime < CACHE_DURATION) {
            return apiCache.states;
        }

        const countries = await getCountries();
        const country = countries.find((c: Country) => c.name.toLowerCase() === 'india')

        const url = `${baseUrl}/countries/${country.iso2}/states`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "X-CSCAPI-KEY": key,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        apiCache.states = data;
        apiCache.statesTime = Date.now();
        return data;
    } catch (err) {
        console.error('Error fetching states:', err);
        return [];
    }
};

export const getCities = async (state: string) => {
    try {
        const states = await getStates();
        const stateO = states.find((s: State) => s.name.toLowerCase() === state.toLowerCase());

        if (!stateO) {
            return [];
        }

        const countries = await getCountries();
        const country = countries.find((c: Country) => c.name.toLowerCase() === 'india')

        if (!country) {
            return [];
        }

        const url = `${baseUrl}/countries/${country.iso2}/states/${stateO.iso2}/cities`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "X-CSCAPI-KEY": key,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        return data.map((d: State) => d.name);
    } catch (err) {
        console.error('Error fetching cities:', err);
        return [];
    }
};

// Experience levels
export const experiences = [
    "Internship",
    "Fresher",
    "1 year",
    "2 year",
    "3 year",
    "4 year",
    "5 year",
    "6 year",
    "7 year",
    "8 year",
    "Above 8 year",
    "Senior",
    "Director",
    "Executive",
];

// Job Type 
export const JobTypes = [
    "Full Time",
    "Permanent",
    "Contract",
];

// Job Mode
export const JobMode = [
    "Hybrid",
    "On Site",
    "Remote",
];

export const DatePosted = ['All Time', 'Past 24 hours', 'Past 3 days', 'Past Week', 'Past Month']