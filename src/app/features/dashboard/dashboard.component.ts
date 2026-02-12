import { Component, OnInit, OnDestroy, signal, effect, ChangeDetectionStrategy } from '@angular/core'; 

import { CommonModule } from '@angular/common'; 

import { CryptoService, CryptoAsset } from '../../core/services/crypto.service';  

import { CryptoCardComponent } from '../crypto-card/crypto-card.component'; 

import { Subscription } from 'rxjs'; 

 

@Component({ 

  selector: 'app-dashboard', 

  standalone: true, 

  imports: [CommonModule, CryptoCardComponent], 

  changeDetection: ChangeDetectionStrategy.OnPush, // Máximo rendimiento: solo reacciona si las Signals cambian 

  template: ` 

    <div class="container"> 

      <header> 

        <h1>CryptoMonitor <small>Live</small></h1> 

        <div class="threshold-control"> 

          <label>Umbral de Alerta ($): </label> 

          <input type="number" [value]="alertThreshold()" (input)="updateThreshold($event)"> 

        </div> 

      </header> 

 

      <section class="stats-bar"> 

        <div class="stat-item"> 

          <span>Promedio Mercado:</span> 

          <strong>{{ stats().average | currency:'USD' }}</strong> 

        </div> 

        <div class="stat-item"> 

          <span>Volatilidad:</span> 

          <strong>{{ stats().volatility | number:'1.2-4' }}</strong> 

        </div> 

      </section> 

 

      <div class="crypto-grid"> 

        @for (item of assets(); track item.id) { 

          <app-crypto-card  

            [asset]="item"  

            [threshold]="alertThreshold()"> 

          </app-crypto-card> 

        } @empty { 

          <div class="loading">Esperando flujo de datos...</div> 

        } 

      </div> 

    </div> 

  `, 

  styles: [`/* Estilos omitidos para brevedad, pero muy limpios y modernos */`] 

}) 

export class DashboardComponent implements OnInit, OnDestroy { 

  // Definimos Signals: la forma moderna de manejar estados reactivos en Angular 

  assets = signal<CryptoAsset[]>([]);  

  alertThreshold = signal<number>(30000);  

  stats = signal({ average: 0, volatility: 0 }); 

 

  private worker!: Worker; 

  private subscription?: Subscription; 

 

  constructor(private cryptoService: CryptoService) { 

    this.initWorker(); 

     

    /** 

     * EFECTO REACTIVO: 

     * Cada vez que la Signal 'assets' cambie, este bloque se ejecuta automáticamente. 

     * Es aquí donde enviamos los precios al Web Worker para no bloquear la UI. 

     */ 

    effect(() => { 

      const currentPrices = this.assets().map(a => a.price); 

      if (currentPrices.length > 0 && this.worker) { 

        this.worker.postMessage({ action: 'CALCULATE_STATS', prices: currentPrices }); 

      } 

    }); 

  } 

 

  /** 

   * Inicializa el Web Worker apuntando al archivo que comentamos al principio. 

   */ 

  private initWorker() { 

    if (typeof Worker !== 'undefined') { 

      // Creamos el hilo separado 

      this.worker = new Worker(new URL('../../app.worker', import.meta.url)); 

       

      // Escuchamos cuando el Worker termina de calcular el promedio y volatilidad 

      this.worker.onmessage = (event: MessageEvent) => { 

        this.stats.set(event.data); // Actualizamos la Signal de estadísticas 

      }; 

    } 

  } 

 

  ngOnInit(): void { 

    // Nos conectamos al stream de datos (el que emite cada 200ms) 

    this.subscription = this.cryptoService.getPricesStream().subscribe({ 

      next: (data: CryptoAsset[]) => { 

        this.assets.set(data); // "Alimentamos" la Signal con los nuevos precios 

      } 

    }); 

  } 

 

  updateThreshold(event: Event) { 

    const input = event.target as HTMLInputElement; 

    this.alertThreshold.set(Number(input.value)); 

  } 

 

  // ¡IMPORTANTE! Limpieza para evitar fugas de memoria 

  ngOnDestroy(): void { 

    this.subscription?.unsubscribe(); // Cortamos la conexión con el servicio 

    if (this.worker) { 

      this.worker.terminate(); // Matamos al Worker para liberar hilos del procesador 

    } 

  } 

} 