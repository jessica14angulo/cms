import { Component, OnInit, Input } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  messageSender: string;
  @Input() message: Message;
  sub: Subscription

  constructor(private contactService: ContactService) { 

  }

  ngOnInit() {
    this.sub = this.contactService.getContact(this.message.sender)
      .subscribe(contactData => {
        this.messageSender = contactData.contact.name;
      })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
