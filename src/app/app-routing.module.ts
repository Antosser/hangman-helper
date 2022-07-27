import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { LoadComponent } from './components/load/load.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LengthComponent } from './components/length/length.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dev/load',
    component: LoadComponent
  },
  {
    path: 'dev/length',
    component: LengthComponent
  },
  {
    path: 'dev/main',
    component: MainComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
