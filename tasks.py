import time

import socketio

from config import app, SOCKET_HOST, SOCKET_PORT, SOCKET_PATH


@app.task
def process_task(data):
    sio = socketio.Client()
    sio.connect(f'http://{SOCKET_HOST}:{SOCKET_PORT}', socketio_path=SOCKET_PATH)
    sleep_time = data
    result = 2

    sio.emit('broadcast', {'room': data, 'result': result})
    times, end = divmod(data, 2)
    progress_step = 100 / times
    sleep_step = sleep_time / times

    print(f'value={data}')
    print(f'progress_step = {progress_step}')
    print(f'sleep_step = {sleep_step}')
    print(f'times = {times}')
    print(f'end = {end}')

    for i in range(times):
        time.sleep(sleep_step)
        result += progress_step
        sio.emit('broadcast', {'room': data, 'result': result})

    time.sleep(0.5)
    sio.emit('end', data)
