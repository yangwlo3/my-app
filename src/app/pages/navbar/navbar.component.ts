import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api'
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(){
    this.items = [
      {label: 'Products', routerLink: '/products', styleClass: 'hover:bg-blue-900 transition duration-300 rounded-lg'},
      {label: 'Users', routerLink: '/users', styleClass: 'hover:bg-blue-900 transition duration-300 rounded-lg'}
    ];
  }
}
