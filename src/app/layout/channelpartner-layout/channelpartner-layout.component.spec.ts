import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelpartnerLayoutComponent } from './channelpartner-layout.component';

describe('ChannelpartnerLayoutComponent', () => {
    let component: ChannelpartnerLayoutComponent;
    let fixture: ComponentFixture<ChannelpartnerLayoutComponent>;

    beforeEach(
        async(() => {
            TestBed.configureTestingModule({
                declarations: [ChannelpartnerLayoutComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ChannelpartnerLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
