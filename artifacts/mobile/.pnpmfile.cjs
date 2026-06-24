// .pnpmfile.cjs
// Hook pnpm pour résoudre les dépendances du workspace dans EAS Build

module.exports = {
  hooks: {
    resolveVirtualRoot: true,
  },
};
