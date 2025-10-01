import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidoresPublicosComponent } from './servidores-publicos.component';

describe('ServidoresPublicosComponent', () => {
  let component: ServidoresPublicosComponent;
  let fixture: ComponentFixture<ServidoresPublicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServidoresPublicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServidoresPublicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
