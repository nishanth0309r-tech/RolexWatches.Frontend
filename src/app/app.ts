import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { routeFadeAnimation } from './animations/route-animations';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeFadeAnimation]
})
export class App {
  constructor(public router: Router) {}

  getRouteAnimationData() {
    return this.router.url;
  }
}