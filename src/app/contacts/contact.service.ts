import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  contactChangedEvent = new EventEmitter<Contact[]>(); 

  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;
  contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    // this.contacts = MOCKCONTACTS;
    // this.getContacts();
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    this.http.get<{ message: string, contacts: Contact[] }>('http://localhost:3000/contacts')
    .subscribe(
      (responseData) => {
        this.contacts = responseData.contacts;
        this.contacts.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  getContact(id: string) {
    // for (const contact of this.contacts) {
    //   if (contact.id === id) {
    //     return contact;
    //   }
    // }
    // return null;
    return this.http.get<{ message: string, contact: Contact }>('http://localhost:3000/contacts/' + id);
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    newContact.id = '';
    const strContact = JSON.stringify(newContact);

    this.http.post('http://localhost:3000/contacts', strContact, { headers: headers })
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
        return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //conver object to string to send in req
    const strContact = JSON.stringify(newContact);

    //send req with contact id, object and headers
    this.http.patch('http://localhost:3000/contacts/' + originalContact.id
      , strContact
      , { headers: headers })
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assign contacts list
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  deleteContact(contact: Contact) {
     if (!contact) {
      return;
    }

    //send request with specific id
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assing list of contacts
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  // storeContacts() {
  //   let contacts = JSON.stringify(this.contacts);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   this.http.put('https://cms-app-86421-default-rtdb.firebaseio.com/contacts.json', contacts, { headers: headers })
  //     .subscribe(
  //       () => {
  //         this.contactListChangedEvent.next(this.contacts.slice());
  //       }
  //     )
  // }
}
