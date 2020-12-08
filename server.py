"""
サーバ
"""
import os
from wsgiref.simple_server import make_server

from module.urls import dispatch


def run(environ, start_response):
    """WSGI

    @param environ HTTPS環境変数
    @param start_response ステータスコード、レスポンスヘッダーを受け取るオブジェクト
    @return レスポンスデータ
    """
    response = dispatch(environ)
    start_response(
        response.status,
        [('Content-Type', '{}'.format(response.content_type))])
    return [response.body.encode('UTF-8')]


if __name__ == '__main__':
    PORT = os.environ.get('PORT', 8000)
    with make_server('', int(PORT), run) as httpd:
        print(f'Serving HTTP on 0.0.0.0 port {PORT} ...')
        httpd.serve_forever()
