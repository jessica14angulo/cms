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

    // this.getDocuments();
    // this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<{ message: string, documents: Document[] }>('http://localhost:3000/documents')
      .subscribe(
        (documentData) => {
          this.documents = documentData.documents;
          // this.maxDocumentId = this.getMaxId();
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

  sortAndSend(){
    this.documents.sort((a, b) =>
            a.name > b.name ? 1 : a.name < b.name ? -1 : 0
          );
  
          //emit the next document list changed event
          this.documentListChangedEvent.next(this.documents.slice());
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    document.id = '';
    const strDocument = JSON.stringify(document);

    this.http.post('http://localhost:3000/documents', strDocument, { headers: headers })
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.documentListChangedEvent.next(this.documents.slice());
        });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    }
    
    const pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return
    }
        
     //set headers
     const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert document object to string
    const strDocument = JSON.stringify(newDocument);

    //send patch request with original document id, new document object and headers
    this.http.patch('http://localhost:3000/documents/' + originalDocument.id
      , strDocument
      , { headers: headers })
      //subscribe to response
      .subscribe(
        (documents: Document[]) => {
          //assign updated document list
          this.documents = documents;
          //emit change
          this.documentListChangedEvent.next(this.documents.slice());
        });
  }
  deleteDocument(document: Document) {
    if (!document) {
      return
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }
        
    this.http.delete('http://localhost:3000/documents/' + document.id)
      //subscribe to response
      .subscribe(
        (documents: Document[]) => {
          //assign modified document list
          this.documents = documents;
          //emit changes
          this.documentListChangedEvent.next(this.documents.slice());
        });
  }

  // deleteDocument(document: Document) {

  //   if (!document) {
  //     return;
  //   }
  
  //   const pos = this.documents.findIndex(d => d.id === document.id);
  
  //   if (pos < 0) {
  //     return;
  //   }
  
  //   // delete from database
  //   this.http.delete('http://localhost:3000/documents/' + document.id)
  //     .subscribe(
  //       (response: Response) => {
  //         this.documents.splice(pos, 1);
  //         this.sortAndSend();
  //       }
  //     );
  // }

  // storeDocuments() {
  //   let documents = JSON.stringify(this.documents);

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   this.http.put('https://cms-app-86421-default-rtdb.firebaseio.com/documents.json', documents, { headers: headers })
  //     .subscribe(
  //       () => {
  //         this.documentListChangedEvent.next(this.documents.slice());
  //       }
  //     )
  // }
}
