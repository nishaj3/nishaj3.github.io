import { initializeScene1 } from './js/scene1.js';
import { initializeScene2 } from './js/scene2.js';
import { initializeScene3 } from './js/scene3.js';

async function fetchCSV(url) {
    try {
        console.log(`Fetching data from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        console.log(`Data fetched from ${url}:`, text);
        return d3.csvParse(text);
    } catch (error) {
        console.error(`Error fetching or parsing CSV file: ${url}`, error);
        throw error; // Re-throw to handle it in the calling function
    }
}

async function loadData() {
    try {
        // Load the CSV files
        const [data1, data2, data3] = await Promise.all([
            fetchCSV("data/unemployment-rate-men-vs-women.csv"),
            fetchCSV("data/female-to-male-ratio-of-time-devoted-to-unpaid-care-work.csv"),
            fetchCSV("data/gender-wage-gap-vs-gdp-per-capita.csv")
        ]);

        console.log('Data1:', data1);
        console.log('Data2:', data2);
        console.log('Data3:', data3);

        // Initialize the scenes
        initializeScene1(data1);
        initializeScene2(data2);
        initializeScene3(data3);
    } catch (error) {
        console.error("Error fetching or parsing CSV file:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadData);
