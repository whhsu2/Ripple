const mainnet = new ripple.RippleAPI({
  server: 'wss://s1.ripple.com'
});

(async function(api) {
  await api.connect();

  let response = await api.getLedger({
    includeTransactions: true
  });
  console.log(response);

})(mainnet);