import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsManagerComponent } from './contacts-manager.component';

describe('ContactsManagerComponent', () => {
  let component: ContactsManagerComponent;
  let fixture: ComponentFixture<ContactsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
