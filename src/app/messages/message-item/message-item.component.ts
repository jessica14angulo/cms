import { Component, OnInit, Input } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  messageSender: string;
  @Input() message: Message;

  constructor(private contactService: ContactService) { 

  }

  ngOnInit() {
    let contact: Contact = this.contactService.getContact(this.message.sender);
    // this.messageSender = contact.name;
    this.messageSender = contact ? contact.name : 'Contact not found';
  }
}
