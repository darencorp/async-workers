from celery import Celery
from flask import Flask

BROKER_HOST = 'redis'
BROKER_PORT = 6379

SOCKET_HOST = 'sockets'
SOCKET_PORT = 8000
SOCKET_PATH = '/messages/socket.io'

STATIC_FOLDER = 'static'
TEMPLATES_FOLDER = 'templates'


def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL'],
        include=['tasks']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery


app_flask = Flask('app', static_folder=STATIC_FOLDER, template_folder=TEMPLATES_FOLDER)
app_flask.config.update(
    CELERY_BROKER_URL=f'redis://{BROKER_HOST}:{BROKER_PORT}',
    CELERY_RESULT_BACKEND=f'redis://{BROKER_HOST}:{BROKER_PORT}'
)

app = make_celery(app_flask)
