require('dotenv').config();
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

async function getAccessToken() {
  const token = await credential.getToken('https://graph.microsoft.com/.default');
  return token.token;
}

async function main() {
  try {
    const accessToken = await getAccessToken();
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
    // List files in root of OneDrive
    const result = await client.api('https://tcfoodbank.sharepoint.com/sites/Marketing/Shared%20Documents/Agency_Tool_Database.xlsx').get();
    console.log('Files in OneDrive root:', result.value.map(file => file.name));
  } catch (err) {
    console.error('Error connecting to Microsoft Graph:', err);
  }
}

main(); 