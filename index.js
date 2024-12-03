const { syncBranches } = require('./utils/syngit-service');

(async () => {
  console.log(`  
   _____              _____ _ _      ______ _____            _____          
  / ____|            / ____(_) |    |  ____|_   _|          |_   _|   /\\    
 | (___  _   _ _ __ | |  __ _| |_   | |__    | |    ______    | |    /  \\   
  \\___ \\| | | | '_ \\| | |_ | |  __| |   __|  | |   |______|   | |   / /\\ \\  
  ____) | |_| | | | | |__| | | |_   | |     _| |_            _| |_ / ____ \\ 
 |_____/ \\__, |_| |_|\\_____|_|\\__|  |_|    |_____|          |_____/_/    \\_\\
          __/ |                                                             
         |___/
`);

  console.log('=== Sincronización de ramas locales ===');
  const results = await syncBranches();

  results.forEach((message) => {
    console.log(message);
  });
})();
