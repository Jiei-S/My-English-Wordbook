"""データベース操作

PostgreSQLサーバにアクセス
"""
import logging.config
import os
from typing import NamedTuple

import psycopg2
from psycopg2.extras import DictCursor


logging.config.fileConfig('./setting/logging.conf')
LOGGER = logging.getLogger()

# データベース定義
DATABASE = {
    'word': [
        ('id serial PRIMARY KEY'),
        ('english text UNIQUE NOT NULL'),
        ('japanese text NOT NULL'),
        ('is_correct boolean DEFAULT FALSE'),
        ('bookmark boolean DEFAULT FALSE')
    ],
    'activity': [
        ('id serial PRIMARY KEY'),
        ('date date NOT NULL'),
        ('type text NOT NULL'),
        ('detail text NOT NULL'),
    ],
}


class Flag(NamedTuple):
    """ フラグ用コンテナ """
    TRUE: str = 'TRUE'
    FALSE: str = 'FALSE'


class DbOperationError(Exception):
    """ データベース操作エラー """
    pass


class Common:
    """ 基底クラス """
    def __init__(self, table):
        """データベース接続及びテーブル作成

        @param table テーブル
        """
        self.conn = psycopg2.connect(
            host=os.environ['PSQL_HOST'],
            dbname=os.environ['PSQL_DB_NAME'],
            user=os.environ['PSQL_USER'],
            password=os.environ['PSQL_PASSWORD'],
        )
        self.cur = self.conn.cursor(cursor_factory=DictCursor)
        self.execute(
            f'CREATE TABLE IF NOT EXISTS {table} ({self.concat_columns(DATABASE[table])});')

    def generator_dict_factory(self, rows):
        """取得データをジェネレータに変換

        @param rows 取得結果
        @return ジェネレータ
        """
        return (dict(r) for r in rows)

    def dict_factory(self, rows):
        """取得データを辞書型に変換

        @param rows 取得結果
        @return [{<カラム名>: <値>}]
        """
        return [dict(r) for r in rows]

    def concat_columns(self, columns):
        """SQL文用にカラムを結合

        @param columns カラム
        @return concat_column カンマで結合したカラム
        """
        concat_column = ''
        for i, c in enumerate(columns):
            concat_column += c

            if i != len(columns) - 1:
                concat_column += ', '
        return concat_column

    def execute(self, sql, data=None):
        """SQL実行

        @param sql SQL文
        @param data プレースホルダーの値
        @exception psycopg2.Error DB操作エラー
        """
        try:
            self.cur.execute(sql, data)
            self.conn.commit()
        except psycopg2.Error as err:
            self.conn.rollback()
            LOGGER.error(err)
            raise DbOperationError(err)


class Word(Common):
    """ wordテーブルクラス """
    def __init__(self):
        """コンストラクタ
        """
        super().__init__('word')

    def insert(self, eng_val, jap_val):
        """挿入

        @param eng_val 英語
        @param jap_val 日本語
        """
        sql = 'INSERT INTO word (english, japanese) '\
            'VALUES (%s, %s) ON CONFLICT (english) DO UPDATE SET japanese = %s;'
        super().execute(sql, (eng_val, jap_val, jap_val))

    def select_learning(self):
        """学習データ取得

        @return 学習データ
        """
        super().execute(
            'SELECT id, english, japanese, bookmark FROM word WHERE is_correct = FALSE;'
        )
        return super().generator_dict_factory(self.cur.fetchall())

    def select_incorrect(self):
        """不正解用データ取得

        @return 不正解用データ
        """
        super().execute('SELECT japanese FROM word WHERE is_correct = FALSE;')
        return self.cur.fetchall()

    def select_english_list(self):
        """単語一覧データ取得

        @return 単語一覧データ
        """
        super().execute('SELECT id, english, japanese, is_correct FROM word ORDER BY id;')
        return super().dict_factory(self.cur.fetchall())

    def select_bookmark(self):
        """ブックマーク一覧データ取得

        @return ブックマーク一覧データ
        """
        super().execute('SELECT id, english, japanese FROM word WHERE bookmark = TRUE;')
        return super().dict_factory(self.cur.fetchall())

    def count_all(self):
        """全単語数取得

        @return 全単語数データ
        """
        super().execute('SELECT COUNT(*) FROM word;')
        return self.cur.fetchone()[0]

    def count_is_correct(self):
        """習得済み単語数取得

        @return 習得済み単語数データ
        """
        super().execute('SELECT COUNT(*) FROM word WHERE is_correct = TRUE;')
        return self.cur.fetchone()[0]

    def count_bookmark(self):
        """ブックマーク数取得

        @return ブックマーク数データ
        """
        super().execute('SELECT COUNT(*) FROM word WHERE bookmark = TRUE;')
        return self.cur.fetchone()[0]

    def update_is_correct_flag(self, pkey, flag):
        """is_correctフラグ更新

        @param pkey PKEY
        @param flag 論理値
        @return 更新した英語
        """
        sql = 'UPDATE word SET is_correct = %s WHERE id = %s RETURNING english;'
        super().execute(sql, (flag, pkey))
        return self.cur.fetchone()[0]

    def update_bookmark_flag(self, pkey, flag):
        """bookmarkフラグ更新

        @param pkey PKEY
        @param flag 論理値
        @return 更新した英語
        """
        sql = 'UPDATE word SET bookmark = %s WHERE id = %s RETURNING english;'
        super().execute(sql, (flag, pkey))
        return self.cur.fetchone()[0]

    def delete(self, pkey):
        """削除

        @param pkey PKEY
        @return 削除した英語
        """
        sql = 'DELETE FROM word WHERE id = %s RETURNING english;'
        super().execute(sql, (pkey,))
        return self.cur.fetchone()[0]


class Activity(Common):
    """ activityテーブルクラス """
    TYPE = (
        (0, 'learning'),
        (1, 'english_list'),
        (2, 'english_list'),
        (3, 'bookmark'),
        (4, 'bookmark'),
    )

    def __init__(self):
        """コンストラクタ
        """
        super().__init__('activity')

    def insert(self, date, type_id, detail):
        """挿入

        @param date アクティビティ日付
        @param type_id アクティビティ種別ID
        @param detail アクティビティ詳細
        """
        sql = 'INSERT INTO activity (date, type, detail) VALUES (%s, %s, %s);'
        super().execute(sql, (date, type_id, detail))

    def select_all(self):
        """全アクティビティ取得

        @return 全アクティビティデータ
        """
        super().execute('SELECT date, type, detail FROM activity ORDER BY id DESC;')
        return super().dict_factory(self.cur.fetchall())

    def select_activity_order_by_desc_limit_5(self):
        """最新アクティビティ5件取得

        @return 最新アクティビティ5件
        """
        super().execute('SELECT type, detail FROM activity ORDER BY id DESC LIMIT 5;')
        return super().dict_factory(self.cur.fetchall())

    def select_count_learning_date(self, from_date, to_date):
        """習得済み単語数取得

        @return 習得済み単語数データ
        """
        sql = 'SELECT COUNT(date), date FROM activity '\
            'WHERE type = %s AND date >= %s AND date <= %s AND detail LIKE %s '\
            'GROUP BY date ORDER BY date;'
        super().execute(
            sql, (str(self.TYPE[0][0]), from_date, to_date, '%習得しました'))
        return super().dict_factory(self.cur.fetchall())
