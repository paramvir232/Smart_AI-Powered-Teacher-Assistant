declare module "dom-to-image-more" {
    interface Options {
      width?: number;
      height?: number;
      style?: Partial<CSSStyleDeclaration>;
      filter?: (node: HTMLElement) => boolean;
      bgcolor?: string;
      quality?: number;
      imagePlaceholder?: string;
      cacheBust?: boolean;
    }
  
    export function toPng(node: HTMLElement, options?: Options): Promise<string>;
    export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
    export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
    export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  
    const domToImage: {
      toPng: typeof toPng;
      toJpeg: typeof toJpeg;
      toBlob: typeof toBlob;
      toSvg: typeof toSvg;
    };
  
    export default domToImage;
  }
  