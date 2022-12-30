const express = require("express")
const secp = require("ethereum-cryptography/secp256k1")
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils")

const { getAddress } = require("./utils/generator")
const app = express()
const cors = require("cors")
const port = 3042

const privateKey = secp.utils.randomPrivateKey()
const publicKey = secp.getPublicKey(privateKey)

app.use(cors())
app.use(express.json())

const balances = {
  "3e93820f8edefc6c9961e848d9fd87dc1490190e": 100, // 460f0612dcafdcf0914fd61b7bb895a7dd5d59d664121716935174636a6bd9e5
  "33d63c84bf4b5a96d69e11312eeb2e8e65317a46": 50, // 89958560357428a3bd70ccce5b22a45f3116415373d01f3b3f9b00bd4b521311
  "0x3": 75,
}

console.log({ privateKey: toHex(privateKey) })
console.log({ publicKey: toHex(getAddress(publicKey)) })

app.get("/balance/:address", (req, res) => {
  const { address } = req.params
  const balance = balances[address] || 0
  res.send({ balance })
})

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body

  setInitialBalance(sender)
  setInitialBalance(recipient)

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" })
  } else {
    balances[sender] -= amount
    balances[recipient] += amount
    res.send({ balance: balances[sender] })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0
  }
}
