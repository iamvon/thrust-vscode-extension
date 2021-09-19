const { Web3Storage } = require('web3.storage');

function getAccessToken() {
    return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient() {
    return new Web3Storage({token: getAccessToken()})
}

module.exports = {
    makeStorageClient
}