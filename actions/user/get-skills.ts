
export const getSkills = async (q?: string): Promise<string[]> => {
    const apiKey = 'NPrhy2sLAaP8zdMZSnjxjEGUWJK7tS4C';
    const url = `https://api.apilayer.com/skills?q=${q}`;

    console.log(q)

    const myHeaders = new Headers();
    myHeaders.append("apikey", apiKey);

    const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result)
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error('Error fetching skills : error');
        return [];
    }
};
