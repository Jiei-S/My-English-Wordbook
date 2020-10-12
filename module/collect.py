"""英語スクレイピング

collect_target.txt内のURLをスクレイピング
スクレイピングした英語はWordテーブルに格納
"""
from concurrent.futures import ThreadPoolExecutor
import re
import sys

from bs4 import BeautifulSoup
import requests

from dbaccess import Word, DbOperationError


def _get_urls(file_path):
    """スクレイピング対象URLを取得

    @param file_path URL格納ファイル
    """
    try:
        with open(file_path, 'r') as file:
            return list(map(lambda file: file.rstrip('\n'), file.readlines()))
    except FileNotFoundError:
        sys.exit()

def _request(urls):
    """リクエスト

    @param urls スクレイピング対象URLのリスト
    @return Responseオブジェクト
    """
    with ThreadPoolExecutor() as executor:
        return executor.map(requests.get, urls, timeout=3)


class Collector:
    """ 英単語のスクレイピング """
    def __init__(self):
        """コンストラクタ
        """
        self._markups = _request(_get_urls('./setting/collect_target.txt'))
        try:
            self._db_word = Word()
        except DbOperationError:
            sys.exit()

    def collect(self):
        """スクレイピング

        @exception HTTPError 接続エラー
        @exception AttributeError 要素取得エラー
        """
        eng_list, jap_list = [], []
        for markup in self._markups:
            try:
                markup.raise_for_status()
            except requests.HTTPError:
                continue

            bs_obj = BeautifulSoup(markup.content, 'lxml')
            try:
                eng = [i.text for i in bs_obj.find_all(class_="eng")]
                jap = [i.text for i in bs_obj.find_all(class_="jap")]
            except AttributeError:
                continue
            eng_list.extend(eng)
            jap_list.extend(jap)

        self.insert_db(eng_list, jap_list)

    def insert_db(self, eng_list, jap_list):
        """DBに挿入

        @param eng_list 英単語リスト
        @param jap_list 日本語リスト
        @exception DbOperationError データベース操作エラー
        """
        reg = re.compile(r'[a-z|A-Z|\s]+')
        for eng, jap in zip(eng_list, jap_list):
            try:
                if reg.match(eng) is None:
                    # 英語以外
                    continue
                self._db_word.insert(eng.strip(), jap)
            except DbOperationError:
                continue


if __name__ == '__main__':
    inst = Collector()
    inst.collect()
