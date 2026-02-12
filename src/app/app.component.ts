import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Verifica que esta ruta sea la correcta. Si falla, intenta: './features/dashboard/dashboard.component'
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <main>
      <app-dashboard></app-dashboard>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      background-color: #f4f7f6;
      padding: 20px;
    }
  `]
})
export class AppComponent {
  title = 'crypto-monitor';
}