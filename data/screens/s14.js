// Original simplified illustrations: Git labels verified from documentation,
// not a live workspace. The gate is educational and is not a Databricks UI.
(function (root) {
  root.DataLab.mockui.register('s14', {
    's14-workspace': {
      title: { es: 'Maqueta simplificada: Workspace → Create → Git folder (solo lectura)', en: 'Simplified mock: Workspace → Create → Git folder (read only)' },
      regions: [
        { kind: 'sidebar', targets: [{ id: 'workspace', label: 'Workspace' }] },
        { kind: 'toolbar', heading: 'Workspace', targets: [{ id: 'create', label: 'Create' }] },
        { kind: 'menu', heading: 'Create', targets: [{ id: 'gitFolder', label: 'Git folder' }] },
      ],
    },
    's14-git-form': {
      title: { es: 'Maqueta simplificada: campos de Git folder; no clona un repositorio', en: 'Simplified mock: Git folder fields; does not clone a repository' },
      regions: [
        { kind: 'form', heading: 'Git folder', targets: [
          { id: 'url', label: 'Git repository URL' },
          { id: 'provider', label: 'Git provider' },
          { id: 'name', label: 'Git folder name' },
        ] },
      ],
    },
    's14-gate': {
      title: { es: 'Ilustración educativa: compuerta Python, no interfaz de despliegue', en: 'Educational illustration: Python gate, not a deployment UI' },
      regions: [
        { kind: 'main', heading: { es: 'SIMULACIÓN CI/CD · solo memoria', en: 'CI/CD SIMULATION · memory only' }, targets: [
          { id: 'tests', label: 'tests=4/4: valid / null / negative / repeat' },
          { id: 'approval', label: { es: 'Aprobación explícita: True o False', en: 'Explicit approval: True or False' } },
          { id: 'eligible', label: 'approved=ELIGIBLE' },
          { id: 'blocked', label: 'no_approval=BLOCKED' },
          { id: 'failed', label: 'failed_tests=BLOCKED' },
        ] },
      ],
    },
  });
})(globalThis);
