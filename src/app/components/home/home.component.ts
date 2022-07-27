import { Component, OnInit } from '@angular/core';
import { WordsService } from 'src/app/services/words.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public words: WordsService) { }

  ngOnInit(): void {
  }

}
