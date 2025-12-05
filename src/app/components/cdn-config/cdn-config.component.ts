import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CDNConfig } from '../../services/estimation.service';

@Component({
  selector: 'app-cdn-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cdn-config.component.html',
  styleUrl: './cdn-config.component.css'
})
export class CDNConfigComponent {
  @Input() config!: CDNConfig;
  @Output() configChange = new EventEmitter<CDNConfig>();

  providers = ['cloudfront', 'cloudflare', 'akamai'];

  onChange() {
    this.configChange.emit(this.config);
  }
}
