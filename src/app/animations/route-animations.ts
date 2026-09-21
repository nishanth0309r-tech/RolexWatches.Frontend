import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const routeFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true }),
      query(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-out', style({ opacity: 0 }))
      ], { optional: true })
    ])
  ])
]);
