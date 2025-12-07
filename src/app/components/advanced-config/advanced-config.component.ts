import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrafficInput } from '../../services/estimation.service';
import { DatabaseConfigComponent } from '../database-config/database-config.component';
import { CDNConfigComponent } from '../cdn-config/cdn-config.component';
import { MessageQueueConfigComponent } from '../message-queue-config/message-queue-config.component';
import { SecurityConfigComponent } from '../security-config/security-config.component';
import { MonitoringConfigComponent } from '../monitoring-config/monitoring-config.component';
import { CICDConfigComponent } from '../cicd-config/cicd-config.component';
import { MultiRegionConfigComponent } from '../multi-region-config/multi-region-config.component';

interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-advanced-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatabaseConfigComponent,
    CDNConfigComponent,
    MessageQueueConfigComponent,
    SecurityConfigComponent,
    MonitoringConfigComponent,
    CICDConfigComponent,
    MultiRegionConfigComponent
  ],
  templateUrl: './advanced-config.component.html',
  styleUrl: './advanced-config.component.css'
})
export class AdvancedConfigComponent {
  @Input() traffic!: TrafficInput;
  @Output() trafficChange = new EventEmitter<TrafficInput>();

  expandedSections: Set<string> = new Set();
  isMainExpanded: boolean = true;

  sections: Section[] = [
    {
      id: 'database',
      title: 'Database & Storage',
      description: 'Managed databases, caching layers, and backup policies.',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7m0 0c0 2.21-3.582 4-8 4s-8-1.79-8-4m0 0C4 4.79 7.582 3 12 3s8 1.79 8 4m0 6c0 .713-.264 1.371-.750 1.957m0 0c-.497.504-1.218.957-2.062 1.266M12 15c4.418 0 8-1.79 8-4',
      color: 'text-blue-600'
    },
    {
      id: 'cdn',
      title: 'Content Delivery',
      description: 'Global CDN distribution, edge computing, and asset caching.',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-green-600'
    },
    {
      id: 'messaging',
      title: 'Messaging & Queues',
      description: 'Event-driven architecture, SQS/SNS, and message brokers.',
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
      color: 'text-purple-600'
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      description: 'WAF, DDoS protection, VPNs, and compliance certifications.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'text-red-600'
    },
    {
      id: 'monitoring',
      title: 'Observability',
      description: 'Centralized logging, APM, tracing, and metric collection.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6',
      color: 'text-yellow-600'
    },
    {
      id: 'cicd',
      title: 'CI/CD Pipeline',
      description: 'Build automation, container registry, and deployment controls.',
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      color: 'text-indigo-600'
    },
    {
      id: 'multi_region',
      title: 'Global Resiliency',
      description: 'Multi-region failover, disaster recovery, and high availability.',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-rose-600'
    }
  ];

  toggleMainExpand() {
    this.isMainExpanded = !this.isMainExpanded;
  }

  toggleSection(sectionId: string) {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  isExpanded(sectionId: string): boolean {
    return this.expandedSections.has(sectionId);
  }

  onChange() {
    this.trafficChange.emit(this.traffic);
  }
}
