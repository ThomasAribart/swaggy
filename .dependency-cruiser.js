/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'This dependency is part of a circular relationship. You might want to revise ' +
        'your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ',
      from: { pathNot: ['dist'], path: [] },
      to: {
        circular: true,
      },
    },
    {
      name: 'no-pages-code-in-shared-code',
      severity: 'error',
      comment: 'Please do not import page-specific code in shared code.',
      from: {
        pathNot: '^src/(pages|AppRoutes)',
      },
      to: { path: '^src/pages' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
        'npm-no-pkg',
      ],
    },

    moduleSystems: ['amd', 'cjs', 'es6', 'tsd'],

    tsPreCompilationDeps: true,

    tsConfig: {
      fileName: 'tsconfig.json',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],

      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
      archi: {
        collapsePattern:
          '^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+|node_modules/[^/]+',
      },
    },
  },
};
