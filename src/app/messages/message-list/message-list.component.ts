import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit{
  messages: Message[] = [
    new Message('8', 'Homework', 'Can you help me with this week assignment?', 'Carlos Cobarrubias'),
    new Message('9', 'Exam', 'I need more time for Exam please', 'Juan Angulo'),
    new Message('10', 'Project', 'Should we start our Project?', 'Cinthia Candia')
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
