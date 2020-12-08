# My-English-Wordbook
英単語学習アプリです。  
英単語を学習できるだけでなく、ブックマークしたり、新しく単語の登録も可能。自分だけの英単語帳を作れます。  
ダッシュボード画面より、習得率や学習進捗を可視化できます。  
[Demo](https://english-wordbook.herokuapp.com/)

## Features
### ダッシュボード  
習得率や学習進捗を可視化できます。  
![ダッシュボード](https://user-images.githubusercontent.com/55335212/96358369-7c3f4600-1141-11eb-8cc4-06ab8ccd9eca.png)

### 学習
英単語を学習できます。
![学習](https://user-images.githubusercontent.com/55335212/96358432-0edfe500-1142-11eb-82fa-5f49a598c59c.png)

### 単語
登録されている英単語を一覧表示します。
![単語](https://user-images.githubusercontent.com/55335212/96358459-5ebeac00-1142-11eb-93e9-519a3b359598.png)

### ブックマーク
ブックマークした英単語を一覧表示します。
![ブックマーク](https://user-images.githubusercontent.com/55335212/96358484-9cbbd000-1142-11eb-96cf-9d6011bf83ff.png)

### アクティビティ
アクティビティを一覧表示します。
![アクティビティ](https://user-images.githubusercontent.com/55335212/96358499-d1c82280-1142-11eb-9980-598b7c86d4df.png)

### 単語登録
新しく単語の登録ができます。
![単語登録](https://user-images.githubusercontent.com/55335212/96358516-f4f2d200-1142-11eb-9d02-1e24b77edfa8.png)

## Requirement
- ライブラリ
```
psycopg2==2.8.6
```
- PostgreSQL環境構築
```
$ export PSQL_HOST=<ホスト名>
$ export PSQL_DB_NAME=<データベース名>
$ export PSQL_USER=<ユーザ名>
$ export PSQL_PASSWORD=<パスワード>
$ export PSQL_PORT=<ポート番号>
```
<参考>  
・[PostgreSQL Downloads](https://www.postgresql.org/download/)  
・[psycopg](https://www.psycopg.org)

## Usage
```
$ git clone https://github.com/Jiei-S/My-English-Wordbook.git
$ cd My-English-Wordbook/
$ python server.py
```

## License
MIT
