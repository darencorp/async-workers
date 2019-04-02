import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SocketService} from "./socket-serivce.service";
import {_} from 'underscore';


declare var UIkit: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'js';
  ioConnection: any;

  progress = 0;

  bars: any = {};

  object = Object;

  constructor(private httpClient: HttpClient, private socketService: SocketService) {
    socketService.initSocket();
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message) => {
        // console.log(message)
        this.bars[message.room] = message.result;
        if (this.bars[message.room] >= 100) {
          setTimeout(() => {
            UIkit.notification('Done ' + message.room + '!', {pos: 'bottom-center', status: 'success'});
            delete this.bars[message.room];
          }, 1000)
        }
      });
  }

  addTask(form) {
    this.httpClient.post('/process', form.value.time).subscribe(response => {
      UIkit.notification('Added task for a ' + form.value.time + ' seconds!', {pos: 'bottom-center', status: 'primary'});
      this.socketService.subscribeTask(response);
    });
  }
}
