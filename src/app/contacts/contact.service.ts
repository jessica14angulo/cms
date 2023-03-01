import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];
  contactChangedEvent = new EventEmitter<Contact[]>(); 

  contactListChangedEvent = new Subject<Contact[]>;
  maxContactId: number;

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    this.getContacts();
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    this.http.get('https://cms-app-86421-default-rtdb.firebaseio.com/contacts.json')
    .subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (newContact === null || newContact === undefined) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    // const contactListClone = this.contacts.slice();

    // this.contactListChangedEvent.next(contactListClone);

    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact === null || originalContact === undefined || 
      newContact === null || newContact === undefined) {
        return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    // const contactListClone = this.contacts.slice();

    // this.contactListChangedEvent.next(contactListClone);
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (contact === null || contact === undefined) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  storeContacts() {
    let contacts = JSON.stringify(this.contacts);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put('https://cms-app-86421-default-rtdb.firebaseio.com/contacts.json', contacts, { headers: headers })
      .subscribe(
        () => {
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      )
  }
}
