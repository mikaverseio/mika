import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings-global',
  templateUrl: './settings-global.page.html',
  styleUrls: ['./settings-global.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SettingsGlobalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
