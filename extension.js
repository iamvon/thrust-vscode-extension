const vscode = require('vscode');
const { showSettings } = require('./settings');
const { getFiles, storeFiles } = require('./web3.storage/store');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('thrust.settings', async () => {
		await showSettings();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('thrust.deploy', async () => {
		if (!process.env.WEB3STORAGE_TOKEN) {
			await showSettings();
		}

		const options = {
			canSelectMany: false,
			openLabel: 'Open',
			canSelectFolders: true,
			canSelectFiles: false,
		};

		const fileUri = await vscode.window.showOpenDialog(options);
		if (fileUri && fileUri[0]) {
			let path = fileUri[0].fsPath;

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Window,
				cancellable: false,
				title: 'Deploying your static website to IPFS & Filecoin...',
			}, async (progress) => {
				progress.report({ increment: 0 });
				let deploy = async () => {
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
				await deploy();
			});
		} else {
			let message = "Folder not found, please select a folder and try again.";
			vscode.window.showInformationMessage(message);
		}
	}));
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
