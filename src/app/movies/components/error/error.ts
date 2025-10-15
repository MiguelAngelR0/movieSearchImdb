import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error',
  imports: [ButtonModule],
  templateUrl: './error.html',
  styles: ``
})
export class Error {
  message = input('');
  onRetry = output<void>();
}
