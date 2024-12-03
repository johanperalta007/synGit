const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

const repoPath = path.resolve(__dirname, '/Users/johan.peralta/Documents/Banco de Bogota/Development/devops-bbog-ee-hefesto');

if (!fs.existsSync(repoPath)) {
  console.error(`El repositorio en la ruta ${repoPath} no existe.`);
  process.exit(1);
}

const git = simpleGit(repoPath);

const mainBranches = ['develop', 'main'];

const syncBranches = async () => {
  const result = [];
  try {
    const currentBranch = (await git.branchLocal()).current;
    result.push(`Revisando la rama actual: ${currentBranch}`);

    const remoteBranch = await findRemoteBranch();

    if (!remoteBranch) {
      result.push(`⚠️ No se encontró una rama remota principal ('develop' o 'main') para sincronizar.`);
      return result;
    }

    result.push(`Sincronizando la rama actual "${currentBranch}" con "origin/${remoteBranch}"...`);

    await git.fetch('origin', remoteBranch);
    const log = await git.log({ from: currentBranch, to: `origin/${remoteBranch}` });

    if (log.total === 0) {
      result.push(`✔️ La rama "${currentBranch}" ya está sincronizada con "origin/${remoteBranch}".`);
    } else {
      await git.pull('origin', remoteBranch);
      result.push(`✔️ La rama "${currentBranch}" ha sido sincronizada con "origin/${remoteBranch}".`);
    }
  } catch (error) {
    result.push(`❌ Error al sincronizar la rama: ${error.message}`);
  }
  return result;
};

const findRemoteBranch = async () => {
  for (const main of mainBranches) {
    try {
      const remoteList = await git.listRemote(['origin']);
      if (remoteList.includes(`refs/heads/${main}`)) {
        return main;
      }
    } catch (err) {
      console.log(`Error al verificar la rama remota: ${err.message}`);
    }
  }
  return null;
};

syncBranches().then((result) => {
  console.log(result.join('\n'));
}).catch((error) => {
  console.error(`Error al ejecutar la sincronización: ${error.message}`);
});

module.exports = {
  syncBranches,
};
