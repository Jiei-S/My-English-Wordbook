/* 
    メニュー
 */
'use strict';
import { Dashboard, Learning, EnglishList, Bookmark, Activity, Register } from './main.js';


export const MENUS = [
  {
    text: 'ダッシュボード',
    iconClassNames: [
      'fas',
      'fa-home',
      'mr-05'
    ],
    renderComponent() {
      location.reload();
    },
    getComponentName() {
      return Dashboard.COMPONENT_NAME;
    },
  },
  {
    text: '学習',
    iconClassNames: [
      'fas',
      'fa-pencil-alt',
      'mr-05'
    ],
    renderComponent() {
      new Learning;
    },
    getComponentName() {
      return Learning.COMPONENT_NAME;
    },
  },
  {
    text: '単語',
    iconClassNames: [
      'fas',
      'fa-clipboard-list',
      'mr-05'
    ],
    renderComponent() {
      new EnglishList;
    },
    getComponentName() {
      return EnglishList.COMPONENT_NAME;
    },
  },
  {
    text: 'ブックマーク',
    iconClassNames: [
      'fas',
      'fa-bookmark',
      'mr-05'
    ],
    renderComponent() {
      new Bookmark;
    },
    getComponentName() {
      return Bookmark.COMPONENT_NAME;
    },
  },
  {
    text: 'アクティビティ',
    iconClassNames: [
      'far',
      'fa-list-alt',
      'mr-05'
    ],
    renderComponent() {
      new Activity;
    },
    getComponentName() {
      return Activity.COMPONENT_NAME;
    },
  },
  {
    text: '単語登録',
    iconClassNames: [
      'fas',
      'fa-plus-circle',
      'mr-05'
    ],
    renderComponent() {
      new Register;
    },
    getComponentName() {
      return Register.COMPONENT_NAME;
    },
  },
];
