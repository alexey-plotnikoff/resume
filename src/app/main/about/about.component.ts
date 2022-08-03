import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  age = 0;

  leftToRight = [
    style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate(
          '1200ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
  ];

  rightToLeft = [
    style({ opacity: 0, transform: 'translateX(100px)' }),
        animate(
          '1200ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
  ];

  constructor() { }

  ngOnInit(): void {
    // TODO: do something with user time
    let birthday = new Date(1987, 1, 22, 20, 0, 0, 0);
    let now = new Date();
    const age = now.getFullYear() - birthday.getFullYear();
    if (age < 35) {
      this.age = 35;
    } else {
      this.age = age;
    }
  }

}
