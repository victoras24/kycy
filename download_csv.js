import fs from 'fs/promises';
import https from 'https';

const DIRECTORY = '/home/esaakidis/elonMusk/CompanyData';

const CSV_URLS = [
    'https://www.data.gov.cy/sites/default/files/organisations_67.csv',
    'https://www.data.gov.cy/sites/default/files/registered_office_70.csv',
    'https://www.data.gov.cy/sites/default/files/organisation_officials_58.csv'
];

const FILE_NAMES = [
    'organisation_data.csv',
    'registered_office_data.csv',
    'organisation_officials_data.csv'
];

// Function to preprocess each CSV file
async function preprocessCSV(filePath) {
    let data = await fs.readFile(filePath, 'utf8');
    // Replace empty fields with NULL values for columns A to K using regex
    data = data.replace(/(,,)+/g, ',NULL,');
    await fs.writeFile(filePath, data);
}

// Function to download a file from URL
function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                fs.writeFile(filePath, data)
                    .then(resolve)
                    .catch(reject);
            });
        }).on('error', reject);
    });
}

// Function to download and preprocess all CSV files
async function downloadAndPreprocessCSVs() {
    for (let i = 0; i < CSV_URLS.length; i++) {
        const url = CSV_URLS[i];
        const fileName = FILE_NAMES[i];
        const filePath = `${DIRECTORY}/${fileName}`;
        try {
            await downloadFile(url, filePath);
            await preprocessCSV(filePath);
            console.log(`Downloaded and preprocessed: ${fileName}`);
        } catch (err) {
            console.error(`Error downloading or preprocessing ${fileName}: ${err}`);
        }
    }
}

downloadAndPreprocessCSVs();
