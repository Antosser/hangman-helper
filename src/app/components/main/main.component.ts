import { WordsService } from 'src/app/services/words.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public words: WordsService) { }

  ngOnInit(): void {
  }
}
