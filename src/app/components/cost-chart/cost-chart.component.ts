import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

@Component({
  selector: 'app-cost-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cost-chart.component.html',
  styleUrl: './cost-chart.component.css'
})
export class CostChartComponent implements OnChanges, AfterViewInit {
  @Input() costBreakdown: any = null;
  @Input() currency: string = 'USD';
  @ViewChild('costChart', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  chartData: ChartDataItem[] = [];

  get currencySymbol(): string {
    const symbols: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥'
    };
    return symbols[this.currency] || '$';
  }

  ngAfterViewInit(): void {
    if (this.costBreakdown) {
      this.updateChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['costBreakdown'] && this.canvas) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.costBreakdown) return;

    const colors: { [key: string]: string } = {
      compute: '#3b82f6',
      database: '#10b981',
      storage: '#f59e0b',
      networking: '#8b5cf6',
      cdn: '#06b6d4',
      messaging: '#ec4899',
      security: '#ef4444',
      monitoring: '#14b8a6',
      cicd: '#f97316',
      multi_region: '#6366f1'
    };

    const total = Object.entries(this.costBreakdown)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [, value]) => sum + ((value as number) || 0), 0);

    this.chartData = [];
    Object.entries(this.costBreakdown).forEach(([key, value]) => {
      if (key !== 'total' && (value as number) > 0) {
        this.chartData.push({
          label: this.formatLabel(key),
          value: value as number,
          color: colors[key] || '#6b7280',
          percentage: ((value as number) / total) * 100
        });
      }
    });

    this.chartData.sort((a, b) => b.value - a.value);
    this.drawPieChart();
  }

  private formatLabel(key: string): string {
    const labels: { [key: string]: string } = {
      compute: 'Compute',
      database: 'Database',
      storage: 'Storage',
      networking: 'Networking',
      cdn: 'CDN',
      messaging: 'Messaging',
      security: 'Security',
      monitoring: 'Monitoring',
      cicd: 'CI/CD',
      multi_region: 'Multi-Region'
    };
    return labels[key] || key;
  }

  private drawPieChart(): void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentAngle = -Math.PI / 2;

    this.chartData.forEach(item => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}
