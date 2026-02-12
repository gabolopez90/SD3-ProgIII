import { Injectable } from '@angular/core'; 

import { interval, map, Observable } from 'rxjs'; 

 

/** 

 * Define la estructura de cada criptomoneda. 

 */ 

export interface CryptoAsset { 

  id: string; 

  name: string; 

  symbol: string; 

  price: number; 

  previousPrice: number; 

  lastUpdate: Date; 

} 

 

// Decorador que marca la clase como un servicio que puede ser inyectado. 

// 'root' significa que el servicio es un "Singleton" (una sola instancia para toda la app). 

@Injectable({ providedIn: 'root' }) 

export class CryptoService { 

   

  // Base de datos local. 

  private assets: CryptoAsset[] = [ 

    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 45000, previousPrice: 45000, lastUpdate: new Date() }, 

    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3200, previousPrice: 3200, lastUpdate: new Date() }, 

    { id: '3', name: 'Solana', symbol: 'SOL', price: 110, previousPrice: 110, lastUpdate: new Date() }, 

    { id: '4', name: 'Cardano', symbol: 'ADA', price: 0.5, previousPrice: 0.5, lastUpdate: new Date() }, 

    { id: '5', name: 'Ripple', symbol: 'XRP', price: 0.6, previousPrice: 0.6, lastUpdate: new Date() } 

  ]; 

 

  /** 

   * Simula un Stream de datos. 

   */ 

  getPricesStream(): Observable<CryptoAsset[]> { 

    // crea intervalo cada 200 milisegundos. 

    return interval(200).pipe( 

      map(() => { 

        // En cada intervalo actualizamos los precios de todo el array 

        this.assets = this.assets.map(asset => { 

           

          // Lógica de Volatilidad: 

          const volatility = (Math.random() * 0.02) - 0.01;  

          const newPrice = Math.max(0, asset.price * (1 + volatility)); 

           

          // Retornamos un NUEVO objeto (Inmutabilidad) con los datos actualizados 

          return { 

            ...asset, 

            previousPrice: asset.price, // Guardamos el valor actual como "anterior" antes de cambiarlo 

            price: newPrice, 

            lastUpdate: new Date() 

          }; 

        }); 

         

        // actualiza la vista. 

        return [...this.assets]; 

      }) 

    ); 

  } 

} 