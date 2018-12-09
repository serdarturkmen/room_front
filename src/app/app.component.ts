import {Component, OnInit} from '@angular/core';
import {Observable, Observer, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {IOccupancy} from './occupancy.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public messages: Subject<string>;
  URL = 'ws://localhost:8000/notifications/';
  occupancy: IOccupancy;

  ngOnInit(): void {
    this.messages = <Subject<string>>this.connect(this.URL)
      .pipe(map((response: MessageEvent): string => {
        return response.data;
      }));
    this.messages.subscribe(msg => {
        console.log('from server:' + msg);
        this.occupancy = JSON.parse(msg);
      }
    );
  }

  private connect(url): Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      });
    const observer = {
      next: (data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
          if (data === 'stop') {
            ws.close(1000, 'bye');
          }
        }
      }
    };
    return Subject.create(observer, observable);
  }
}
