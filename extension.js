const vscode = require('vscode');
const { showSettings, settingsApiToken, settingsPublishFolder } = require('./settings');
const { getFiles, storeFiles } = require('./web3.storage/store');
const dotenv = require('dotenv');
const apiTokenEnvPath = __dirname + "/.web3StorageApiToken.env";
const publishFolderEnvPath = __dirname + "/.publishFolder.env";
dotenv.config({ path: apiTokenEnvPath });
dotenv.config({ path: publishFolderEnvPath });

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('thrust.settings', async () => {
		await showSettings();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('thrust.publish', async () => {

		if (!process.env.WEB3STORAGE_TOKEN) {
			await settingsApiToken();
			return;
		}

		if (!process.env.DEPLOY_FOLDER_PATH) {
			await settingsPublishFolder();
			return;
		}

		let path = process.env.DEPLOY_FOLDER_PATH;
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			cancellable: false,
			title: 'Publishing your static website to IPFS & Filecoin...',
		}, async (progress) => {
			progress.report({ increment: 0 });
			let publish = async () => {
				const files = await getFiles(path);
				const cid = await storeFiles(files);
				progress.report({ increment: 100 });
				const userSelection = await vscode.window.showInformationMessage(`Done, here is your website's CID: ${cid}`, 'Go to the website');
				if (userSelection === 'Go to the website') {
					vscode.env.openExternal(vscode.Uri.parse(
						`https://${cid}.ipfs.dweb.link`
					));
				}
			};
			await publish();
		});
	}));
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
