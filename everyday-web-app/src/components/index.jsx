// Registry of shared components — import.meta.glob collects everything under
// this folder so call sites with 2+ shared components can do:
//   import Components from '@components'; const { Foo, Bar } = Components;
// For a single component prefer a direct import instead (see
// MONOREPO-ARCHITECTURE-TEMPLATE.md §10.3 for the tradeoff).
const modules = import.meta.glob('./**/[A-Z]*.jsx', { eager: true });

const Components = Object.entries(modules).reduce((acc, [filePath, mod]) => {
  const name = filePath.split('/').pop().replace('.jsx', '');
  acc[name] = mod.default;
  return acc;
}, {});

export default Components;
