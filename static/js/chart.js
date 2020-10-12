/* 
    グラフ
 */
'use strict';
import { util } from './component.js';


/**
 * キャンバス生成
 * 
 * @param {Number} width キャンバス幅
 * @param {Number} height キャンバス高さ
 * @return {Array} [{Element} キャンバス, {Object} CanvasRenderingContext2D]
 */
const _createCanvas = ({ width = null, height = null }) => {
  const canvas = document.createElement('canvas');

  if (width) {
    canvas.width = width;
  }
  if (height) {
    canvas.height = height;
  }
  return [canvas, canvas.getContext('2d')];
};


export class LearningRateChart {
  /**
   * 習得率グラフ
   * 
   * @param {Number} wordTotal 登録単語数
   * @param {Number} isCorrectTotal 習得済み単語数
   */
  constructor(wordTotal, isCorrectTotal) {
    this._wordTotal = wordTotal;
    this._isCorrectTotal = isCorrectTotal;
    this._nonCorrectTotal = this._wordTotal - this._isCorrectTotal;
    this._chartData = {
      type: 'doughnut',
      data: {
        labels: [
          '習得済み',
          '未習得'
        ],
        datasets: [{
          backgroundColor: [
            '#3ea8ff',
            '#66CC00'
          ],
          data: [
            this._isCorrectTotal,
            this._nonCorrectTotal
          ]
        }],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          display: false,
        },
      },
      plugins: {
        setTextStyle: function (ctx) {
          ctx.font = Chart.helpers.fontString(30, 'normal', 'Helvetica Neue');
          ctx.fillStyle = '#555555';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          return ctx;
        },
        afterDatasetsDraw: function (chart) {
          const canvas = chart.ctx.canvas;
          const ctx = this.setTextStyle(chart.ctx);

          ctx.fillText(
            `${(isCorrectTotal / wordTotal * 100).toFixed(1)}%`,
            canvas.clientWidth / 2,
            Math.round((canvas.clientHeight + chart.chartArea.top) / 2)
          );
        }
      }
    };
    [this._canvas, this._ctx] = _createCanvas({ height: 160 });
    new Chart(this._ctx, this._chartData);
  }

  /**
   * 要素返却
   * 
   * @return {Element} 習得率グラフ
   */
  get component() {
    return util.createDocumentFragment([
      util.createWrap({
        classNames: ['w-70'],
        innerElm: [this._canvas]
      }),
      this._createDetailWrap(
        this._chartData.data.labels,
        this._chartData.data.datasets[0].backgroundColor,
        [this._isCorrectTotal, this._nonCorrectTotal]
      )
    ]);
  }

  /**
   * 習得率詳細生成(ラッパー)
   * 
   * @param {Array} labels ラベル
   * @param {Array} shapeColors シェイプの色
   * @param {Array} nums グラフデータ
   * @return {Element} 習得率詳細
   */
  _createDetailWrap(labels, shapeColors, nums) {
    return util.createWrap({
      classNames: ['w-30'],
      innerElm: labels.map((label, idx) => {
        return util.createDocumentFragment([
          this._createLegend(label, shapeColors[idx]),
          this._createLegendNum(nums[idx])
        ]);
      })
    });
  }

  /**
   * 凡例生成
   * 
   * @param {String} label ラベル
   * @param {String} shapeColor シェイプの色
   * @return {Element} 凡例
   */
  _createLegend(label, shapeColor) {
    const shape = document.createElement('span');
    const text = document.createElement('div');

    shape.style.backgroundColor = shapeColor;
    text.textContent = label;
    return util.createWrap({
      classNames: [
        'd-flex',
        'learning-rate-shape-wrap'
      ],
      innerElm: [
        shape,
        text
      ]
    });
  }

  /**
   * 凡例の数値生成
   * 
   * @param {Number} numVal グラフデータ
   * @return {Element} 凡例の数値
   */
  _createLegendNum(numVal) {
    const num = document.createTextNode(numVal);
    const per = document.createElement('span');

    per.textContent = '語';
    per.classList.add(...['ml-05', 'font-size-1']);
    return util.createWrap({
      classNames: [
        'learning-rate-num',
        'tx-center',
        'font-size-2'
      ],
      innerElm: [
        num,
        per
      ]
    });
  }
}


export class LearningLogChart {
  /**
   * 習得ロググラフ
   * 
   * @param {Array} learningLogData 習得ログデータ
   */
  constructor(learningLogData) {
    this._learningLogData = learningLogData;
    [this._counts, this._dates] = [[], []];
    this._learningLogData.forEach(d => {
      this._counts.push(d.count);
      this._dates.push(d.date);
    });
    this._chartData = {
      type: 'line',
      data: {
        labels: this._dates,
        datasets: [{
          data: this._counts,
          fill: false,
          borderColor: '#3ea8ff',
        }],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 18,
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.yLabel}語`;
            },
          }
        }
      }
    };
    [this._canvas, this._ctx] = _createCanvas({ height: 60 });
    new Chart(this._ctx, this._chartData);
  }

  /**
   * 要素返却
   * 
   * @return {Element} 習得ロググラフ
   */
  get component() {
    return util.createWrap({
      innerElm: [this._canvas]
    });
  }
}