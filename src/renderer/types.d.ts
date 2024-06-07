declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.svg' {
    import React from 'react';
    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}