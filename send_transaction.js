// Continuing after connecting to the API
async function doPrepare() {
    const sender = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sender,
      "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
      "Destination": "rUCzEr6jrEyMpjhs4wSdQdz4g8Y382NxfM"
    }, {
      // Expire this transaction if it doesn't execute within ~5 minutes:
      "maxLedgerVersionOffset": 75
    })
    const maxLedgerVersion = preparedTx.instructions.maxLedgerVersion
    console.log("Prepared transaction instructions:", preparedTx.txJSON)
    console.log("Transaction cost:", preparedTx.instructions.fee, "XRP")
    console.log("Transaction expires after ledger:", maxLedgerVersion)
    return preparedTx.txJSON
  }

txJSON = JSON.stringify(doPrepare())

ripple = require('ripple-lib')
api = new ripple.RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})
api.connect()

// Continuing from the previous step...
const response = api.sign(txJSON, "s████████████████████████████")
const txID = response.id
console.log("Identifying hash:", txID)
const txBlob = response.signedTransaction
console.log("Signed blob:", txBlob)


// Submit the Signed Blob
// use txBlob from the previous example
async function doSubmit(txBlob) {
    const latestLedgerVersion = await api.getLedgerVersion()
  
    const result = await api.submit(txBlob)
  
    console.log("Tentative result code:", result.resultCode)
    console.log("Tentative result message:", result.resultMessage)
  
    // Return the earliest ledger index this transaction could appear in
    // as a result of this submission, which is the first one after the
    // validated ledger at time of submission.
    return latestLedgerVersion + 1
  }
  const earliestLedgerVersion = doSubmit(txBlob)