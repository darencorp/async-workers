import {Injectable} from '@angular/core';
import * as socketIo from 'socket.io-client';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() {
  }

  private socket;

  public initSocket(): void {
    this.socket = socketIo('http://localhost:8000', { path: '/messages/socket.io' });
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('feed', (data: any) => observer.next(data));
    });
  }

  public subscribeTask(task: any): void {
    this.socket.emit('enter', task)
  }
}
