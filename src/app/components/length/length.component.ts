import { WordsService } from 'src/app/services/words.service';
import { Component, OnInit } from '@angular/core';
// import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-length',
  templateUrl: './length.component.html',
  styleUrls: ['./length.component.scss']
})
export class LengthComponent implements OnInit {
  wordLength = 0;

  constructor(private words: WordsService) { }

  ngOnInit(): void {
  }

  continue() {
    console.log(this.wordLength);
    if (this.wordLength > 0) {
      this.words.setWordLength(this.wordLength);
      this.words.state = 'use';
    }
  }
}
