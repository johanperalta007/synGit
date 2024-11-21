const simpleGit = require('simple-git');
const path = require('path');

// Configuración de simple-git
const git = simpleGit(path.resolve('')); // Ruta del repositorio local

// Ramas principales
const mainBranches = ['develop', 'master'];

const syncBranches = async () => {
  const result = [];
  try {
    // Obtener ramas locales
    const branches = await git.branchLocal();

    for (const branch of branches.all) {
      result.push(`Revisando la rama: ${branch}`);

      // Cambiar a la rama actual
      await git.checkout(branch);

      // Encontrar la rama remota principal
      const remoteBranch = await findRemoteBranch(branch);

      if (!remoteBranch) {
        result.push(`⚠️ No se encontró una rama remota principal para "${branch}".`);
        continue;
      }

      // Comparar la rama local con la remota
      await git.fetch();
      const log = await git.log({ from: branch, to: `origin/${remoteBranch}` });

      if (log.total === 0) {
        result.push(`✔️ La rama "${branch}" está sincronizada con "${remoteBranch}".`);
      } else {
        result.push(`↕️ La rama "${branch}" tiene diferencias con "${remoteBranch}". Bajando cambios...`);
        await git.pull('origin', remoteBranch);
        result.push(`✔️ La rama "${branch}" ha sido sincronizada con "${remoteBranch}".`);
      }
    }
  } catch (error) {
    result.push(`❌ Error al sincronizar ramas: ${error.message}`);
  }
  return result;
};

// Función auxiliar para encontrar la rama remota principal
const findRemoteBranch = async (branch) => {
  for (const main of mainBranches) {
    const isRemoteExist = await git.listRemote([`origin/${main}`]);
    if (isRemoteExist.includes(main)) {
      return main;
    }
  }
  return null;
};

module.exports = {
  syncBranches,
};
