import { Component, Input, ChangeDetectionStrategy } from '@angular/core'; 

import { CommonModule } from '@angular/common'; 

import { HighlightChangeDirective } from '../../shared/directives/highlight-change.directive'; 

import { CryptoAsset } from '../../core/services/crypto.service'; 

 

@Component({ 

  selector: 'app-crypto-card', 

  standalone: true, 

  imports: [CommonModule, HighlightChangeDirective],  

  // OPTIMIZACIÓN CLAVE: Solo se renderiza si el objeto 'asset' cambia su referencia. 

  // Ideal para flujos de datos constantes (como el de 200ms que definimos). 

  changeDetection: ChangeDetectionStrategy.OnPush, 

  template: ` 

    <div class="card" [class.alert-mode]="asset.price > threshold"> 

      <div class="header"> 

        <span class="symbol">{{ asset.symbol }}</span> 

        <span class="name">{{ asset.name }}</span> 

      </div> 

       

      <div class="price-container"  

           [appHighlightChange]="asset.price"  

           [prevPrice]="asset.previousPrice"> 

        {{ asset.price | currency:'USD':'symbol':'1.2-2' }} 

      </div> 

 

      @if (asset.price > threshold) { 

        <div class="alert-label">⚠️ UMBRAL SUPERADO</div> 

      } 

    </div> 

  `, 

  styles: [` 

    .card { 

      background: #fff; border-radius: 12px; padding: 16px; 

      box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid transparent; 

      transition: all 0.3s ease; 

    } 

    .header { display: flex; justify-content: space-between; margin-bottom: 10px; } 

    .symbol { font-weight: bold; color: #555; } 

    .price-container { font-size: 1.5rem; font-weight: 800; text-align: center; border-radius: 4px; } 

     

    /* Efecto visual cuando el precio es "peligroso" */ 

    .alert-mode {  

      border-color: #ff4d4d;  

      background-color: #fff5f5;  

      animation: shake 0.5s; /* La tarjeta vibra */ 

    } 

    .alert-label { color: #ff4d4d; font-size: 0.7rem; font-weight: bold; text-align: center; margin-top: 8px; } 

     

    /* IMPORTANTE: ::ng-deep permite que los estilos de este componente  

       afecten a las clases aplicadas por la Directiva (flash-green/red), 

       incluso si esas clases no están en el HTML original. 

    */ 

    :host ::ng-deep .flash-green { color: #27ae60 !important; background-color: #e8f5e9; } 

    :host ::ng-deep .flash-red { color: #e74c3c !important; background-color: #fce4ec; } 

     

    @keyframes shake { 

      0%, 100% { transform: translateX(0); } 

      25% { transform: translateX(-5px); } 

      75% { transform: translateX(5px); } 

    } 

  `] 

}) 

export class CryptoCardComponent { 

  // El decorador required asegura que el componente no se use sin datos 

  @Input({ required: true }) asset!: CryptoAsset; 

  // Precio límite para disparar la alerta visual 

  @Input() threshold: number = 0;
}