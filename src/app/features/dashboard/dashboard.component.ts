import { Component, OnInit, OnDestroy, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { CryptoService, CryptoAsset } from '../../core/services/crypto.service'; 
import { CryptoCardComponent } from '../crypto-card/crypto-card.component'; 
import { Subscription } from 'rxjs'; 
 
@Component({ 
  selector: 'app-dashboard', 
  standalone: true, 
  imports: [CommonModule, CryptoCardComponent], 
  changeDetection: ChangeDetectionStrategy.OnPush, 
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
          <span>Promedio Global:</span> 
          <strong>{{ stats().average | currency:'USD' }}</strong> 
        </div> 
        <div class="stat-item"> 
          <span>Índice Volatilidad:</span> 
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
          <p>Cargando datos...</p> 
        } 
      </div> 
    </div> 
  `, 
  styles: [` 
    .container { max-width: 1000px; margin: 0 auto; padding: 20px; font-family: sans-serif; } 
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 10px; } 
    .threshold-control input { padding: 8px; border-radius: 5px; border: 1px solid #ccc; width: 100px; } 
    .stats-bar { display: flex; gap: 20px; background: #2c3e50; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; } 
    .crypto-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; } 
  `] 
}) 
export class DashboardComponent implements OnInit, OnDestroy { 
  // Signals requeridos por el ejercicio 
  assets = signal<CryptoAsset[]>([]); 
  alertThreshold = signal<number>(30000); 
  stats = signal({ average: 0, volatility: 0 }); 
 
  private worker!: Worker; 
  private subscription?: Subscription; 
 
  constructor(private cryptoService: CryptoService) { 
    this.initWorker(); 
 
    // Effect: Cada vez que 'assets' cambie, le mandamos los precios al worker 
    effect(() => { 
      const currentPrices = this.assets().map(a => a.price); 
      if (currentPrices.length > 0) { 
        this.worker.postMessage({ action: 'CALCULATE_STATS', prices: currentPrices }); 
      } 
    }); 
  } 
 
  private initWorker() { 
    if (typeof Worker !== 'undefined') { 
      this.worker = new Worker(new URL('../../app.worker', import.meta.url)); 
      this.worker.onmessage = ({ data }) => { 
        this.stats.set(data); // Actualizamos el signal de estadísticas 
      }; 
    } 
  } 
 
  ngOnInit() { 
    this.subscription = this.cryptoService.getPricesStream().subscribe(data => { 
      this.assets.set(data); 
    }); 
  } 
 
  updateThreshold(event: Event) { 
    const input = event.target as HTMLInputElement; 
    this.alertThreshold.set(Number(input.value)); 
  } 
 
  ngOnDestroy() { 
    this.subscription?.unsubscribe(); 
    this.worker.terminate(); 
  } 
}