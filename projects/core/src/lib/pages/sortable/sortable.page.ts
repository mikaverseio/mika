import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent } from "@ionic/angular/standalone";
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MikaApiService } from '../../services/http/mika-api.service';
import { LocalizePipe } from '../../pipes/localize';

@Component({
  selector: 'app-sortable',
  templateUrl: './sortable.page.html',
  styleUrls: ['./sortable.page.scss'],
  standalone: true,
  imports: [IonContent, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, LocalizePipe,TranslatePipe, CommonModule, DragDropModule]
})
export class SortablePage  implements OnInit {

  items = [];
  field: any = 'title';
  slug: any;
  loaded: boolean = false;

  constructor(
    private api: MikaApiService,
    private route: ActivatedRoute
  ) {
		this.field = this.route.snapshot.paramMap.get('field');
		this.slug = this.route.snapshot.paramMap.get('slug');
		this.fetch();
  }

  ngOnInit() { }


	fetch() {
		this.api.get(`${this.slug}/all`, { orderBy: 'order' }).subscribe({
			next: (res) => {
				this.loaded = true;
				this.items = res;
			},
			error: () => {
				this.loaded = true;
			}
		});
	}

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    const items = this.items.map((item: any, index: number) => { return { id: item.id, order: index } });
    this.api.patch(`${this.slug}/sortable`, items).subscribe();
  }

}
