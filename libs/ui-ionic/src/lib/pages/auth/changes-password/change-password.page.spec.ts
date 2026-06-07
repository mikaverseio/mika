import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChangePasswordPage } from './change-password.page';

describe('ChangePasswordPage', () => {
    let component: ChangePasswordPage;
    let fixture: ComponentFixture<ChangePasswordPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChangePasswordPage],
            imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
