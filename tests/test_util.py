"""pytest

util.py
"""
import os
import pytest
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from module import util


@pytest.mark.parametrize('input', [
    ('index.html'),
    ('404.html'),
])
def test_open_file_001(input):
    """ファイル読み込み
    正常ケース

    in:
      'index.html'
    expect:
      HTMLコード
    in:
      '404.html'
    expect:
      HTMLコード
    """
    with open(input, 'r') as file:
        assert util.open_file(input) == file.read()

def test_open_file_002():
    """ファイル読み込み
    エラーケース

    in:
      'FileNotFoundError.html'
    expect:
      FileNotFoundError
    """
    with pytest.raises(FileNotFoundError):
        with open('FileNotFoundError.html', 'r') as file:
            file.read()
