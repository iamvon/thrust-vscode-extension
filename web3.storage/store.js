const { getFilesFromPath } = require('files-from-path');
const { makeStorageClient } = require('./web3storage');

async function getFiles(path) {
    const files = await getFilesFromPath(path);
    files.forEach(file => {
        if (file.name.charAt(0) === '/') {
            file.name = file.name.split('/').slice(2).join('/');
        } else {
            file.name = file.name.split('/').slice(1).join('/');
        }
    });
    return files;
}

async function storeFiles(files) {
    const client = makeStorageClient();
    try {
        const cid = await client.put(files);
        return cid;
    } catch (e) {
        console.log('Store files error: ', e);
    }
}

module.exports = {
    getFiles,
    storeFiles
}