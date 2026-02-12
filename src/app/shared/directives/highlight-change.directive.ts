import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core'; 

 

@Directive({ 

  selector: '[appHighlightChange]', // Se usa como atributo en el HTML, ej: <div [appHighlightChange]="price"> 

  standalone: true 

}) 

export class HighlightChangeDirective implements OnChanges { 

  // Recibimos el precio actual (usando el selector como alias) y el precio anterior 

  @Input('appHighlightChange') price: number = 0; 

  @Input() prevPrice: number = 0; 

 

  constructor( 

    private el: ElementRef,     

    private renderer: Renderer2  

  ) {} 

 

  /** 

   * Se ejecuta cada vez que uno de los @Input cambia. 

   */ 

  ngOnChanges(changes: SimpleChanges): void { 

    // Solo actuamos si el precio cambió y no es la primera vez que se carga (el valor inicial) 

    if (changes['price'] && !changes['price'].isFirstChange()) { 

      const current = changes['price'].currentValue; 

      const prev = this.prevPrice; 

 

      // Paso 1: Limpiamos las clases de animaciones anteriores 

      this.renderer.removeClass(this.el.nativeElement, 'flash-green'); 

      this.renderer.removeClass(this.el.nativeElement, 'flash-red'); 

 

      /** 

       * Fuerza al navegador a recalcular el estilo. 

       */ 

      void this.el.nativeElement.offsetWidth; 

 

      // Paso 3: Aplicamos la clase correspondiente según la tendencia 

      if (current > prev) { 

        this.renderer.addClass(this.el.nativeElement, 'flash-green'); 

      } else if (current < prev) { 

        this.renderer.addClass(this.el.nativeElement, 'flash-red'); 

      } 

    } 

  } 

} 