import { trigger, transition, style, animate } from '@angular/animations';

export const routeFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ opacity: 0.72 }),
    animate('220ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1 }))
  ])
]);
