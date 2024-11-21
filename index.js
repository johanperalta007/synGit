const { syncBranches } = require('./utils/syngit-service');

(async () => {
  console.log('=== Sincronización de ramas locales ===');
  const results = await syncBranches();

  results.forEach((message) => {
    console.log(message);
  });
})();
