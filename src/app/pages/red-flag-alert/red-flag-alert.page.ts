import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-red-flag-alert',
  templateUrl: './red-flag-alert.page.html',
  styleUrls: ['./red-flag-alert.page.scss'],
})
export class RedFlagAlertPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

