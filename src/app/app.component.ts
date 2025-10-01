import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeModeService } from './core/services/theme-mode.service';
import { RedirectComponent } from './views/pages/auth/redirect.component';
// ./views/pages/redirect/redirect.component
@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo2';

  constructor(private themeModeService: ThemeModeService) {}

}
