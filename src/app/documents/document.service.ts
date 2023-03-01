import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  // documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>;

  
  constructor(private http: HttpClient) { 
    // this.documents = MOCKDOCUMENTS;
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get('https://cms-app-86421-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.log(error);
        }
      )
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {

    let maxId = 0

    for (const document of this.documents) {
      const currentId = +document.id
        if (currentId > maxId) {
          maxId = currentId
        }     
    }  
    return maxId
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || newDocument === null) {
      return
    }   

    this.maxDocumentId++
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument === undefined || originalDocument === null || 
      newDocument === undefined || originalDocument === null) {
      return
    }
    
    const pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return
    }
        
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }
  deleteDocument(document: Document) {
    if (document === undefined || document === null) {
      return
    }
        
    const pos = this.documents.indexOf(document)
    if (pos < 0) {
      return
    }

    this.documents.splice(pos, 1);
    // this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  storeDocuments() {
    let documents = JSON.stringify(this.documents);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put('https://cms-app-86421-default-rtdb.firebaseio.com/documents.json', documents, { headers: headers })
      .subscribe(
        () => {
          this.documentListChangedEvent.next(this.documents.slice());
        }
      )
  }
}
