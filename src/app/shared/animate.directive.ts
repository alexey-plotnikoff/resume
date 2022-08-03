import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import {
  AnimationBuilder,
  AnimationFactory,
  AnimationMetadata,
  AnimationPlayer,
  style,
  animate,
} from '@angular/animations';

@Directive({
  selector: '[sxpAnimate]',
})
export class AnimateDirective {

  @Input() animateInAnimation: AnimationMetadata | AnimationMetadata[] | null;
  @Input() animateOnce = false;
  private wasAnimated = false;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll() {
    if (!this.animateOnce || !this.wasAnimated) {
      this.animate();
    }
  }

  private animating: boolean;
  private player: AnimationPlayer | null;

  private defaults: any = {
    offset: 0,
  };

  constructor(
    private el: ElementRef,
    private animationBuilder: AnimationBuilder
  ) {
    this.animateInAnimation = null;
    this.animating = false;
    this.player = null;
  }

  ngOnInit() {
    this.initialize();
    this.animate();
  }

  private initialize(): void {
    let animation: AnimationFactory;

    if (
      this.animateInAnimation !== null &&
      this.animateInAnimation !== undefined
    ) {
      animation = this.animationBuilder.build(this.animateInAnimation);
    } else {
      animation = this.animationBuilder.build([
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate(
          '1200ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ]);
    }

    this.player = animation.create(this.el.nativeElement);
    this.player.init();
  }

  private animate(): void {
    const inView = this.isInViewport();

    if (!inView) this.animating = false;
    if (!inView || this.animating) return;

    if (this.player) {
      this.player.play();
    }
    this.animating = true;

    this.wasAnimated = true;
  }

  private isInViewport(): boolean {
    const bounding = this.el.nativeElement.getBoundingClientRect();

    let top =
      bounding.top -
      (window.innerHeight || document.documentElement.clientHeight);
    let bottom = bounding.top + bounding.height + this.defaults.offset;

    return top < 0 && bottom > 0;
  }
}
