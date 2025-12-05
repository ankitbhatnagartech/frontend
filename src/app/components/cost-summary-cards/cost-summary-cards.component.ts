import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cost-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cost-summary-cards.component.html',
  styleUrl: './cost-summary-cards.component.css'
})
export class CostSummaryCardsComponent implements OnChanges {
  @Input() totalCost: number = 0;
  @Input() currency: string = 'USD';
  @Input() dailyActiveUsers: number = 0;
  @Input() yearlyCost: number = 0;

  displayTotalCost: number = 0;
  displayCostPerUser: number = 0;
  displayYearlyCost: number = 0;

  get currencySymbol(): string {
    const symbols: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥'
    };
    return symbols[this.currency] || '$';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalCost'] || changes['dailyActiveUsers'] || changes['yearlyCost']) {
      this.animateCounter();
    }
  }

  private animateCounter(): void {
    const duration = 1000;
    const steps = 60;
    const increment = duration / steps;

    const targetTotal = this.totalCost;
    const targetPerUser = this.dailyActiveUsers > 0 ? this.totalCost / this.dailyActiveUsers : 0;
    const targetYearly = this.yearlyCost;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      this.displayTotalCost = targetTotal * progress;
      this.displayCostPerUser = targetPerUser * progress;
      this.displayYearlyCost = targetYearly * progress;

      if (currentStep >= steps) {
        clearInterval(interval);
        this.displayTotalCost = targetTotal;
        this.displayCostPerUser = targetPerUser;
        this.displayYearlyCost = targetYearly;
      }
    }, increment);
  }
}
