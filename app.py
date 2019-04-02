import json

from flask import render_template, request
from tasks import process_task
from config import app_flask


@app_flask.route('/')
def index():
    return render_template('index.html')


@app_flask.route('/process', methods=['POST'])
def test():
    data = json.loads(request.data)
    process_task.delay(data)
    return json.dumps(data)


if __name__ == '__main__':
    app_flask.run('0.0.0.0', 8000, True)
