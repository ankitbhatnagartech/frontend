import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseConfig } from '../../services/estimation.service';

@Component({
  selector: 'app-database-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './database-config.component.html',
  styleUrl: './database-config.component.css'
})
export class DatabaseConfigComponent {
  @Input() config!: DatabaseConfig;
  @Output() configChange = new EventEmitter<DatabaseConfig>();

  databaseTypes = ['rds', 'dynamodb', 'firestore'];
  cacheTypes = ['redis', 'memcached', 'none'];

  onChange() {
    this.configChange.emit(this.config);
  }
}
