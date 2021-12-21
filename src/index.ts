import * as $ from 'jquery';
import * as _ from 'lodash';
import { getColorName } from './util';

const renderSolidColorDom = (color: string, index: number) => {
  return `<div id="qingcloud-color-dom-${index}" style="display: flex; flex-direction: column; padding: 0 16px;">${getColorName(_.toLower(color))}</div>`;
};

const renderPropertyColorDom = (color: string, index: number) => {
  return `<div id="qingcloud-color-dom-${index}" style="display: flex; flex-direction: column; margin: 5px -32px 0;">${getColorName(_.toLower(color))}</div>`;
};

$(document).on('click', '#react-page', function(){
  setTimeout(function() {
    // 删除之前的颜色变量DOM
    $('div[id^="qingcloud-color-dom"]').remove();
    // 添加颜色变量DOM
    const colorDoms = $('span[class^="colors_inspect_panel--paintColor"]');
    if (colorDoms.length > 1) {
      _.forEach(colorDoms, (_c: any, i: number) => {
        const currentDom = colorDoms.eq(i);
        currentDom.parent().parent().append(renderSolidColorDom(currentDom.html(), i));
      });
    } 
    else if (colorDoms.length === 1) {
      colorDoms.parent().parent().append(renderSolidColorDom(colorDoms.html(), 0));
    }
  },200);
});

