import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>;
  
  // documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document[];
  maxDocumentId: number;
  
  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
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
    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
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
    document[pos] = newDocument;
    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
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
    this.documentListChangedEvent.next(this.documents.slice());
}
}
