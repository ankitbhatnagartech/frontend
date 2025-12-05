import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageQueueConfig } from '../../services/estimation.service';

@Component({
  selector: 'app-message-queue-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-queue-config.component.html',
  styleUrl: './message-queue-config.component.css'
})
export class MessageQueueConfigComponent {
  @Input() config!: MessageQueueConfig;
  @Output() configChange = new EventEmitter<MessageQueueConfig>();

  queueTypes = ['sqs', 'rabbitmq', 'kafka', 'kinesis'];

  onChange() {
    this.configChange.emit(this.config);
  }
}
