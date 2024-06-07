import path from 'path';

const root = path.resolve(__dirname, '..');
console.log(root);

const src = path.join(root, 'src');
const srcMain = path.join(src, 'main');
const srcMainPreload = path.join(srcMain, 'preload');
const srcRenderer = path.join(src, 'renderer');
const srcCommon = path.join(src, 'common');


const dist = path.join(root, 'dist');
const distMain = path.join(dist, 'main');
const distRenderer = path.join(dist, 'renderer');

export default {
  root,
  src,
  srcMain,
  srcMainPreload,
  srcRenderer,
  srcCommon,
  dist,
  distMain,
  distRenderer,
};
