const { window } = require('vscode');
const fs = require('fs');

async function showSettings() {
    const apiToken = await window.showInputBox({
        value: '',
        placeHolder: 'Please enter your Web3 Storage API token'
    });

    if (!apiToken) { return; }
    process.env.WEB3STORAGE_TOKEN = apiToken;
    try {
        let envPath = __dirname + "/.web3StorageApiToken.env";
        fs.writeFileSync(envPath, `WEB3STORAGE_TOKEN=${apiToken}`);
    } catch(e) {
        console.log(e);
    }

    window.showInformationMessage(`Setting Web3 Storage API token successfully!`);
}

module.exports = {
    showSettings
}