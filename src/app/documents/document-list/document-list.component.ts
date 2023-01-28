import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Indigo', 'Like a diary, Indigo recounts the stories and experience RM has gone through.', 'https://open.spotify.com/album/', null),
    new Document('2', 'The Astronaut', '"The Astronaut sits on a beautiful harmony between the calming sounds of acustic guitar and a gradual build-up of synth sound."', 'https://open.spotify.com/album/', null),
    new Document('3', 'Jack in the Box', 'The album represents j-hope’s own musical personality and vision as an artist.', 'https://open.spotify.com/album/0FrC9lzgVhziJenigsrXdl?si=HxkUPd', null),
    new Document('4', 'Proof', 'The album comprises 48 tracks total, from the greatest hit songs, and solo/sub-unit tracks selected by each member, unreleased tracks to special tracks.', 'https://open.spotify.com/album/', null)
  ]

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
