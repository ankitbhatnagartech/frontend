import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiRegionConfig } from '../../services/estimation.service';

@Component({
    selector: 'app-multi-region-config',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './multi-region-config.component.html',
    styles: []
})
export class MultiRegionConfigComponent {
    @Input() config!: MultiRegionConfig;
    @Output() configChange = new EventEmitter<MultiRegionConfig>();

    replicationTypes = ['async', 'sync', 'active-active'];

    onChange() {
        this.configChange.emit(this.config);
    }
}
