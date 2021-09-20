const { window } = require('vscode');
const fs = require('fs');
const apiTokenEnvPath = __dirname + "/.web3StorageApiToken.env";
const publishFolderEnvPath = __dirname + "/.publishFolder.env";

async function settingsApiToken() {
    const apiToken = await window.showInputBox({
        value: '',
        placeHolder: 'Please enter your Web3 Storage API token'
    });

    if (!apiToken) { return; }
    process.env.WEB3STORAGE_TOKEN = apiToken;
    try {
        fs.writeFileSync(apiTokenEnvPath, `WEB3STORAGE_TOKEN=${apiToken}`);
        window.showInformationMessage(`Setting Web3 Storage API token successfully!`);
    } catch (e) {
        console.log(e);
    }
}

async function settingsPublishFolder() {
    const options = {
        canSelectMany: false,
        openLabel: 'Open',
        canSelectFolders: true,
        canSelectFiles: false,
    };

    const fileUri = await window.showOpenDialog(options);
    if (fileUri && fileUri[0]) {
        let publishFolderPath = fileUri[0].fsPath;
        process.env.DEPLOY_FOLDER_PATH = publishFolderPath;
        try {
            fs.writeFileSync(publishFolderEnvPath, `DEPLOY_FOLDER_PATH=${publishFolderPath}`);
            window.showInformationMessage(`Setting publish folder successfully!`);
        } catch (e) {
            console.log(e);
        }
    } else {
        let message = "Folder not found, please select a folder and try again.";
        window.showInformationMessage(message);
    }
}

async function showSettings() {
    let mode = await window.showQuickPick(['Settings API Token', 'Settings Publish Folder'], { placeHolder: 'Choose your settings' });

    switch (mode) {
        case undefined:
            return;
        case 'Settings API Token':
            return settingsApiToken();
        case 'Settings Publish Folder':
            return settingsPublishFolder();
    }
}

module.exports = {
    showSettings,
    settingsApiToken,
    settingsPublishFolder
}