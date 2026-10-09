import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type EditorialPageType = 'about' | 'collections' | 'contact';

@Component({
  selector: 'app-editorial-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './editorial-page.html',
  styleUrl: './editorial-page.css'
})
export class EditorialPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  page = signal<EditorialPageType>('about');

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const page = data['page'];
      if (page === 'about' || page === 'collections' || page === 'contact') {
        this.page.set(page);
      }
    });
  }
}
