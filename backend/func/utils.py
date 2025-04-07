import json


def pretty_print(data):
    if isinstance(data, set):
        data = list(data)
    print(json.dumps(data, indent=2, ensure_ascii=False))