import { round as _round, isObject as _isObject, toUpper as _toUpper } from 'lodash';
interface Color {
	[key: string]: string | Object;
}

// 变量内容缓存map
const VARIABLE_COLOR = require( './scss-variable.json');

const hex2rgb = (hex: string) => {
    return [parseInt('0x' + hex.substring(1, 3)), parseInt('0x' + hex.substring(3, 5)),  parseInt('0x' + hex.substring(5, 7))];
};

const hex2hsl = (hex: string) => {
    const rgb = [parseInt('0x' + hex.substring(1, 3)) / 255, parseInt('0x' + hex.substring(3, 5)) / 255, parseInt('0x' + hex.substring(5, 7)) / 255];
    let min, max, delta, h, s, l;
    let r = Number(rgb[0]), g = Number(rgb[1]), b = Number(rgb[2]);
    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;
    s = 0;
    if (l > 0 && l < 1) {
        s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
    }
    h = 0;
    if(delta > 0) {
      if (max === r && max !== g) {
        h += (g - b) / delta;
      }
      if (max === g && max !== b) {
        h += (2 + (b - r) / delta);
      }
      if (max === b && max !== r) {
        h += (4 + (r - g) / delta);
      }
      h /= 6;
    }
    return [_round(h * 255), _round(s * 255), _round(l * 255)];
};

const init = () => {
    return Object.keys(VARIABLE_COLOR).map((k: string) => {
        const rgb = hex2rgb(k);
        const hsl = hex2hsl(k);
        return [rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2], k, VARIABLE_COLOR[k]];
    });
};

const VARIABLE_COLOR_FORMAT: Array<any> = init();

const getColorName = (hex: string) => {
    const rgb = hex2rgb(hex);
    const r = rgb[0], g = rgb[1], b = rgb[2];
    const hsl = hex2hsl(hex);
    const h = hsl[0], s = hsl[1], l = hsl[2];
    let ndf1 = 0, ndf2 = 0, ndf = 0;
    let cl = -1, df = -1;
    let v = '';
    let hasExist = false;
    Object.keys(VARIABLE_COLOR).forEach((k: string) => {
        // 匹配已有的hex
        if (hex === k) {
            hasExist = true;
            v = `<div style="display: flex; flex-direction: column;">与${_toUpper(hex)}相等的颜色变量`;
            const o: Color = VARIABLE_COLOR[k];
            if (_isObject(o)) {
                Object.keys(o).forEach((i: string) => {
                    v += `<div>* ${i}</div>`;
                });
            } else {
                v += `<div>* ${o}</div>`;
            }
            v += '</div>';
        }
    });
    // 当不存在对应的hex值时
    if (!hasExist) {
        VARIABLE_COLOR_FORMAT.forEach((item: any, index: number) => {
            ndf1 = Math.pow(r - item[0], 2) + Math.pow(g - item[1], 2) + Math.pow(b - item[2], 2);
            ndf2 = Math.pow(h - item[3], 2) + Math.pow(s - item[4], 2) + Math.pow(l - item[5], 2);
            ndf = ndf1 + ndf2 * 2;
            if (df < 0 || df > ndf) {
                df = ndf;
                cl = index;
            }
        });
        if (cl < 0) {
            v += `<div style="display: flex; flex-direction: column;">无效的颜色代码</div>`;
        } else {
            v += `<div style="display: flex; flex-direction: column;">与${_toUpper(hex)}相近的颜色变量`;
            const k = VARIABLE_COLOR_FORMAT[cl][6];
            const o = VARIABLE_COLOR_FORMAT[cl][7];
            if (_isObject(o)) {
                Object.keys(o).forEach((i: string) => {
                    v += `<div>* ${i}</div>`;
                });
            } else {
                v += `<div>* ${o}</div>`;
            }
            v += '</div>';
        }
    }
    return v;
};

export { getColorName };