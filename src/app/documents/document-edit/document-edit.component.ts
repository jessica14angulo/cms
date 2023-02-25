import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {

}

ngOnInit() {
  this.route.params.subscribe (
    (params: Params) => {
       const id = params['id'];
       if (!id) {
        this.editMode = false;
          return
       }
          
       this.originalDocument = this.documentService.getDocument(id);
  
       if (!this.originalDocument) {
        return
       }
       this.editMode = true;
       this.document = JSON.parse(JSON.stringify(this.originalDocument));
    }) 
  }

  onSubmit(form: NgForm) {
    const values = form.value; // get values from form’s fields
    const newDocument = new Document(
      null,
      values.name, 
      values.description, 
      values.documentUrl,
      null);
  
    if (this.editMode === true) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else{
     this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents'], {relativeTo: this.route})
 }

  onCancel() {
    this.router.navigate(['/documents'], {relativeTo: this.route});
  }

}
