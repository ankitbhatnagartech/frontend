import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrafficInput } from '../../services/estimation.service';

@Component({
  selector: 'app-advanced-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-config.component.html',
  styleUrl: './advanced-config.component.css'
})
export class AdvancedConfigComponent {
  @Input() traffic!: TrafficInput;
  @Output() trafficChange = new EventEmitter<TrafficInput>();

  filterText: string = '';
  filteredSections: Set<string> = new Set();
  isExpanded: boolean = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  onFilterChange() {
    const filter = this.filterText.toLowerCase();
    this.filteredSections.clear();

    const keywords: { [key: string]: string[] } = {
      database: ['database', 'db', 'sql', 'nosql', 'rds', 'storage', 'data'],
      cdn: ['cdn', 'content', 'delivery', 'network', 'cache', 'edge', 'cloudfront'],
      messaging: ['messaging', 'queue', 'sqs', 'sns', 'kafka', 'rabbitmq', 'event'],
      security: ['security', 'waf', 'shield', 'firewall', 'protection', 'ddos', 'vpn', 'compliance'],
      monitoring: ['monitoring', 'logging', 'cloudwatch', 'observability', 'metrics', 'trace'],
      cicd: ['cicd', 'ci/cd', 'deployment', 'pipeline', 'build', 'jenkins', 'github', 'actions'],
      multi_region: ['multi', 'region', 'availability', 'disaster', 'recovery', 'ha', 'global']
    };

    if (!filter) {
      return;
    }

    Object.entries(keywords).forEach(([section, terms]) => {
      if (terms.some(term => term.includes(filter) || filter.includes(term))) {
        this.filteredSections.add(section);
      }
    });
  }

  showSection(section: string): boolean {
    if (!this.filterText) return true;
    return this.filteredSections.has(section);
  }

  onChange() {
    this.trafficChange.emit(this.traffic);
  }
}
