import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { NgForm } from '@angular/forms'


@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  
  id: string;

  editMode: boolean = false;
	hasGroup: boolean = false;
	invalidGroupContact: boolean;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) {
    }
  // ngOnInit() {
  //   this.route.params.subscribe (
  //     (params: Params) => {
  //        const id = params['id'];
  //        if (!id) {
  //         this.editMode = false
  //           return;
  //        }
            
  //        this.originalContact = this.contactService.getContact(id);
  //        if (!this.originalContact) {
  //         return;
  //        }
             
  //        this.editMode = true
  //        this.contact = JSON.parse(JSON.stringify(this.originalContact));
   
  //        if (this.contact.group !== null && this.contact.group !== undefined) {
  //         this.hasGroup = true;
  //         // this.contact = JSON.parse(JSON.stringify(this.originalContact.group));
  //         // this.groupContacts = this.contact.group.slice();
  //         this.groupContacts = [...this.contact.group];
  //        }    
  //   }) 
  // }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params['id'];
        if(this.id == undefined || this.id == null){
          this.editMode = false;
          return
        }
        // this.originalContact = this.contactService.getContact(this.id);
        this.contactService.getContact(this.id).subscribe((contactData) => {
          this.originalContact = contactData.contact;
        });
  

        if(this.originalContact == undefined || this.originalContact == null){
          return
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if(this.contact.group){
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact));
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    const values = form.value;
    const newContact = new Contact(
      null, 
      values.name, 
      values.email, 
      values.phone, 
      values.imageUrl, 
      this.groupContacts);

    if (this.editMode === true) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts'], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['/contacts'], {relativeTo: this.route});
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }

    if (newContact.id === this.contact.id) {
      return true;
    }

    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
		const selectedContact: Contact = $event.dragData;
		this.invalidGroupContact = this.isInvalidContact(selectedContact);
		if (this.invalidGroupContact) {
			return;
		}
		this.groupContacts.push(selectedContact);
		this.invalidGroupContact = false;
	}

	onRemoveItem(idx: number) {
		if (idx < 0 || idx >= 
      this.groupContacts.length) {
			return;
		}

		this.groupContacts.splice(idx, 1);
		this.invalidGroupContact = false;
	}

}
