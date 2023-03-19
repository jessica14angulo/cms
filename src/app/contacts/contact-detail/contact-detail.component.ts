// import { Component, Input, OnInit } from '@angular/core';
// import { Contact } from '../contact.model';
// import { ContactService } from '../contact.service';
// import { Router, ActivatedRoute, Params} from '@angular/router';

// @Component({
//   selector: 'app-contact-detail',
//   templateUrl: './contact-detail.component.html',
//   styleUrls: ['./contact-detail.component.css']
// })
// export class ContactDetailComponent implements OnInit{
//   contact: Contact;

//   constructor(private contactService: ContactService,
//     private router: Router,
//     private route: ActivatedRoute) {

//   }

//   ngOnInit() {
//     this.route.params
//     .subscribe(
//       (params: Params) => {
//         this.contact = this.contactService.getContact(params['id']);
//       }
//     )
//   }

//   onDelete() {
//     this.contactService.deleteContact(this.contact);
//     this.router.navigateByUrl('/contacts');
//   }
// }


import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit, OnDestroy {
  @Input() contact: Contact;
  id: string;
  sub: Subscription

  constructor(private contactService: ContactService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.sub = this.contactService.getContact(this.id).subscribe((contactData)=>{
        this.contact = contactData.contact;
      });
    })
  }

  onDelete(){
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl("/contacts")
    // this.router.navigate(['/contacts'], {relativeTo:this.activeRoute})
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}