import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CICDConfig } from '../../services/estimation.service';

@Component({
    selector: 'app-cicd-config',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cicd-config.component.html',
    styles: []
})
export class CICDConfigComponent {
    @Input() config!: CICDConfig;
    @Output() configChange = new EventEmitter<CICDConfig>();

    providers = ['github-actions', 'gitlab-ci', 'jenkins', 'circleci', 'aws-codepipeline'];

    onChange() {
        this.configChange.emit(this.config);
    }
}
