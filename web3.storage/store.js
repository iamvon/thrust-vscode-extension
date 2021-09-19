const { getFilesFromPath } = require('files-from-path');
const { makeStorageClient } = require('./web3storage');

async function getFiles(path) {
    const files = await getFilesFromPath(path);
    files.forEach(file => {
        file.name = file.name.split('/').slice(2).join('/');
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