const { keccak256 } = require("ethereum-cryptography/keccak")
exports.getAddress = (publicKey) => keccak256(publicKey.slice(1)).slice(12)
