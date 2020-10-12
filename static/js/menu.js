/* 
    メニュー
 */
'use strict';
import { Learning, EnglishList, Bookmark, Activity, Register } from './main.js';


export const MENUS = [
  {
    text: '学習',
    iconClassNames: [
      'fas',
      'fa-pencil-alt',
      'mr-05'
    ],
    renderComponent(e) {
      new Learning;
      toggleMenu(e.target.closest('.menu').dataset.componentName);
    },
    getComponentName() {
      return Learning.COMPONENT_NAME;
    },
  },
  {
    text: '単語一覧',
    iconClassNames: [
      'fas',
      'fa-clipboard-list',
      'mr-05'
    ],
    renderComponent(e) {
      new EnglishList;
      toggleMenu(e.target.closest('.menu').dataset.componentName);
    },
    getComponentName() {
      return EnglishList.COMPONENT_NAME;
    },
  },
  {
    text: 'ブックマーク一覧',
    iconClassNames: [
      'fas',
      'fa-bookmark',
      'mr-05'
    ],
    renderComponent(e) {
      new Bookmark;
      toggleMenu(e.target.closest('.menu').dataset.componentName);
    },
    getComponentName() {
      return 'bookmark';
    },
  },
  {
    text: 'アクティビティ一覧',
    iconClassNames: [
      'far',
      'fa-list-alt',
      'mr-05'
    ],
    renderComponent(e) {
      new Activity;
      toggleMenu(e.target.closest('.menu').dataset.componentName);
    },
    getComponentName() {
      return 'activity';
    },
  },
  {
    text: '単語登録',
    iconClassNames: [
      'fas',
      'fa-plus-circle',
      'mr-05'
    ],
    renderComponent(e) {
      new Register;
      toggleMenu(e.target.closest('.menu').dataset.componentName);
    },
    getComponentName() {
      return 'register';
    },
  },
];


/**
 * カレント画面判定により、該当メニュー非表示
 * 
 * @param {String} targetComponentName コンポーネント名
 * @return {undefined} undefined
 */
const toggleMenu = (targetComponentName) => {
  const menus = document.getElementsByClassName('menu');

  Array.from(menus).forEach(menu => {
    if (menu.dataset.componentName === targetComponentName) {
      menu.classList.add('d-none');
    } else {
      menu.classList.remove('d-none');
    }
  });
};