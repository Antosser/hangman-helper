import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, timer } from 'rxjs';

const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

@Injectable({
  providedIn: 'root'
})
export class WordsService {
  wordsList: string[] = [];
  state: 'select' | 'load' | 'length' | 'use' = 'select';
  language: 'en' | 'de' = 'en';
  wordLength = 5;
  word: {letter: string}[];
  bestLetter = 'Unknown';
  filteredWords: string[] = [];
  excludedLetters: string[] = [];
  alphabet = alphabet;

  constructor(private http: HttpClient) {
    this.word = [];
    for (let i = 0; i < this.wordLength; i++) {
      this.word.push({letter: ''});
    }
  }

  loadWords() {
    this.state = 'load';

    return new Observable<{success: boolean}>(observer => {
      this.http.get('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt', {
        responseType: 'text'
      }).subscribe({
        next: (data) => {
          this.wordsList = data.split('\n');

          for (let i = 0; i < this.wordsList.length; i++) {
            // remove all non-alphabetic characters
            this.wordsList[i] = this.wordsList[i].replace(/[^a-zA-Z]/g, '');
          }

          this.state = 'length';
          observer.next({success: true});
          console.log(this.wordsList);
        },
        error: (error) => {
          this.state = 'select';
          observer.next({success: false});
        }
      });
    });
  }

  setLang(lang: 'en' | 'de') {
    this.language = lang;
  }

  setWordLength(length: number) {
    this.wordLength = length;
    this.word = [];
    for (let i = 0; i < this.wordLength; i++) {
      this.word.push({letter: ''});
    }
  }

  changeLetter(event: Event) {
    console.log(event);
  }

  getWord() {
    let word = '';
    this.word.forEach(letter => {
      word += letter.letter;
    });

    return word;
  }

  update() {
    timer(10).subscribe(() => {
      for (let i = 0; i < this.wordLength; i++) {
        if (this.word[i].letter.length > 1) {
          this.word[i].letter = this.word[i].letter.substring(this.word[i].letter.length - 1, this.word[i].letter.length);
        }

        this.word[i].letter = this.word[i].letter.toUpperCase();
      }
    });
  }

  flipLetter(letter: string) {
    if (this.excludedLetters.includes(letter)) {
      this.excludedLetters.splice(this.excludedLetters.indexOf(letter), 1);
    }
    else {
      this.excludedLetters.push(letter);
    }
  }

  calculate() {
    this.state = 'load'

    new Observable<void>(
      observer => {
        let currentWord = this.word.map(letter => letter.letter);
        let filteredWords = this.wordsList.filter(word => word.length === this.wordLength)
        .filter(word => !this.excludedLetters.some(letter => word.includes(letter)));

        for (let i = 0; i < currentWord.length; i++) {
          if (currentWord[i] === '') continue;
          filteredWords = filteredWords.filter(word => word.substring(i, i + 1) === currentWord[i].toLowerCase());
        }

        this.filteredWords = filteredWords;

        let mostUsedLetter = new Map<string, number>();

        let freeSpaces: number[] = [];
        for (let i = 0; i < currentWord.length; i++) {
          if (currentWord[i] === '') {
            freeSpaces.push(i);
          }
        }

        for (let i = 0; i < filteredWords.length; i++) {
          let word = filteredWords[i];
          for (let j of freeSpaces) {
            let letter = word.substring(j, j + 1);
            if (!currentWord.includes(letter)) {
              if (mostUsedLetter.has(letter)) {
                mostUsedLetter.set(letter, <number>mostUsedLetter.get(letter) + 1);
              }
              else {
                mostUsedLetter.set(letter, 1);
              }
            }
          }
        }

        // Sort the map by value
        let sorted = Array.from(mostUsedLetter.entries()).sort((a, b) => b[1] - a[1]);

        if (sorted.length > 0) {
          this.bestLetter = sorted[0][0];
        }
        else {
          this.bestLetter = 'Unknown';
        }

        observer.next();
      }
    ).subscribe(
      () => {
        this.state = 'use';
      }
    );
  }

  exclude(letter: string) {
    if (!this.excludedLetters.includes(letter) && letter.length === 1) {
      this.excludedLetters.push(letter);
    }
  }
}
