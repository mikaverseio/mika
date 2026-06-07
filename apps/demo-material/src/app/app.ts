import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MikaRootMaterialComponent } from "@mikaverse/ui-material";

@Component({
	imports: [RouterOutlet, MikaRootMaterialComponent],
	selector: 'app-root',
	templateUrl: './app.html',
	styleUrl: './app.scss',
})
export class App {
	protected title = 'demo-material';
}
