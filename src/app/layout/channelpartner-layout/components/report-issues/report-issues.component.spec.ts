import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { reportissuesComponent } from './report-issues.component';

describe('reportissuesComponent', () => {
    let component: reportissuesComponent;
    let fixture: ComponentFixture<reportissuesComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [reportissuesComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(reportissuesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
