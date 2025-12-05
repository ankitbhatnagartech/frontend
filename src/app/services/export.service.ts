import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EstimationResult } from './estimation.service';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    exportToPDF(result: EstimationResult, architecture: string, currency: string): void {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('ArchCost Estimation Report', 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

        // Architecture & Summary
        doc.setFontSize(12);
        doc.text(`Architecture: ${architecture.toUpperCase()}`, 14, 38);
        doc.text(`Currency: ${currency}`, 14, 44);
        doc.text(`Daily Active Users: ${result.traffic_input.daily_active_users.toLocaleString()}`, 14, 50);

        // Monthly Cost Summary
        doc.setFontSize(14);
        doc.text('Monthly Cost Breakdown', 14, 62);

        const costData = [
            ['Component', 'Cost'],
            ['Compute', `${currency} ${result.monthly_cost.compute.toFixed(2)}`],
            ['Database', `${currency} ${result.monthly_cost.database.toFixed(2)}`],
            ['Storage', `${currency} ${result.monthly_cost.storage.toFixed(2)}`],
            ['Networking', `${currency} ${result.monthly_cost.networking.toFixed(2)}`],
            ['CDN', `${currency} ${result.monthly_cost.cdn.toFixed(2)}`],
            ['Messaging', `${currency} ${result.monthly_cost.messaging.toFixed(2)}`],
            ['Security', `${currency} ${result.monthly_cost.security.toFixed(2)}`],
            ['Monitoring', `${currency} ${result.monthly_cost.monitoring.toFixed(2)}`],
            ['CI/CD', `${currency} ${result.monthly_cost.cicd.toFixed(2)}`],
            ['Multi-Region', `${currency} ${result.monthly_cost.multi_region.toFixed(2)}`],
            ['TOTAL', `${currency} ${result.monthly_cost.total.toFixed(2)}`]
        ];

        autoTable(doc, {
            startY: 68,
            head: [costData[0]],
            body: costData.slice(1),
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }
        });

        // Cloud Provider Comparison
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        doc.setFontSize(14);
        doc.text('Cloud Provider Comparison', 14, finalY + 10);

        const providerData = Object.entries(result.multi_cloud_costs).map(([provider, cost]) => [
            provider,
            `${currency} ${cost.toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: finalY + 16,
            head: [['Provider', 'Monthly Cost']],
            body: providerData,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }
        });

        // Save
        doc.save(`archcost-estimation-${new Date().getTime()}.pdf`);
    }

    exportToCSV(result: EstimationResult, architecture: string, currency: string): void {
        const rows = [];

        // Header
        rows.push(['ArchCost Estimation Report']);
        rows.push(['Generated', new Date().toLocaleString()]);
        rows.push(['Architecture', architecture.toUpperCase()]);
        rows.push(['Currency', currency]);
        rows.push(['Daily Active Users', result.traffic_input.daily_active_users]);
        rows.push([]);

        // Monthly Cost Breakdown
        rows.push(['Monthly Cost Breakdown']);
        rows.push(['Component', 'Cost']);
        rows.push(['Compute', result.monthly_cost.compute.toFixed(2)]);
        rows.push(['Database', result.monthly_cost.database.toFixed(2)]);
        rows.push(['Storage', result.monthly_cost.storage.toFixed(2)]);
        rows.push(['Networking', result.monthly_cost.networking.toFixed(2)]);
        rows.push(['CDN', result.monthly_cost.cdn.toFixed(2)]);
        rows.push(['Messaging', result.monthly_cost.messaging.toFixed(2)]);
        rows.push(['Security', result.monthly_cost.security.toFixed(2)]);
        rows.push(['Monitoring', result.monthly_cost.monitoring.toFixed(2)]);
        rows.push(['CI/CD', result.monthly_cost.cicd.toFixed(2)]);
        rows.push(['Multi-Region', result.monthly_cost.multi_region.toFixed(2)]);
        rows.push(['TOTAL', result.monthly_cost.total.toFixed(2)]);
        rows.push([]);

        // Cloud Provider Comparison
        rows.push(['Cloud Provider Comparison']);
        rows.push(['Provider', 'Monthly Cost']);
        Object.entries(result.multi_cloud_costs).forEach(([provider, cost]) => {
            rows.push([provider, cost.toFixed(2)]);
        });
        rows.push([]);

        // Infrastructure Requirements
        rows.push(['Infrastructure Requirements']);
        Object.entries(result.infrastructure_requirements).forEach(([key, value]) => {
            rows.push([key, value]);
        });
        rows.push([]);

        // Business Metrics
        rows.push(['Business Metrics']);
        Object.entries(result.business_metrics).forEach(([key, value]) => {
            rows.push([key, value]);
        });

        // Convert to CSV string
        const csvContent = rows.map(row => row.join(',')).join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `archcost-estimation-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
