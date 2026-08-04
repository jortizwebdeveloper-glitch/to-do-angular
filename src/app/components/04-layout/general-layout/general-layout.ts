import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navaside } from '@components/02-molecules/navaside/navaside';
import { NavService } from '@/app/services/nav.service';
import { Icon } from '../../01-atoms/icon/icon';

@Component({
  selector: 'app-general-layout',
  imports: [RouterOutlet, Navaside, Icon],
  templateUrl: './general-layout.html',
  styleUrl: './general-layout.css',
})
export class GeneralLayout {
  private navService = inject(NavService);

  date_menu = this.navService.date_menu;
  categories_menu = this.navService.categories_menu;
  tags_menu = this.navService.tags_menu;
}
