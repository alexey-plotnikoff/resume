import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger("hideShow", [
      state('hide', style({
        left: '-300px'
      })),
      state('shown', style({
        left: '0px'
      })),
      transition('hide <=> shown', [
        animate('0.4s')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  show = true;
  private readonly showHeaderWidth = 992;

  private resizeObservable: Observable<Event> | null;
  private resizeSubscription: Subscription | null;

  private scrollObservable: Observable<Event> | null;
  private scrollSubscription: Subscription | null;
  private menuItems: NodeListOf<HTMLAnchorElement> | null;

  constructor() {
    this.resizeObservable = null;
    this.resizeSubscription = null;
    this.scrollObservable = null;
    this.scrollSubscription = null;
    this.menuItems = null;
  }

  ngOnInit(): void {
    this.show = window.innerWidth >= this.showHeaderWidth;

    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe( event => {
      if (event.target && event.target instanceof Window) {
        if (event.target.innerWidth >= this.showHeaderWidth) {
          this.show = true;
        } else {
          this.show = false;
        }
      }
    });

    this.menuItems = document.querySelectorAll('#navbar .scrollto');
    this.scrollObservable = fromEvent(window, 'scroll');
    this.scrollSubscription = this.scrollObservable.subscribe( event => {
      this.activateNabbarLink();
    });
    this.activateNabbarLink();
  }

  toggle() {
    this.show = !this.show;
  }

  activateNabbarLink() {
    this.menuItems?.forEach(navbarLink => {
      if (!navbarLink.hash) {
        return;
      }
      const section = document.querySelector(navbarLink.hash) as HTMLElement;
      if (!section) {
        return;
      }
      const position = window.scrollY + window.innerHeight / 2;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarLink.classList.add('active')
      } else {
        navbarLink.classList.remove('active')
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
