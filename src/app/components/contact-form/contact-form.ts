import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact, Phone } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);

  contactForm!: FormGroup;
  contactId: string | null = null;
  isEditMode = false;
  contactLoaded = false;

  constructor() {
    effect(() => {
      const contacts = this.contactService.contacts$();
      if (this.isEditMode && this.contactId && !this.contactLoaded && contacts.length > 0) {
        const contact = this.contactService.getContactById(this.contactId);
        if (contact) {
          this.loadContact(this.contactId);
          this.contactLoaded = true;
        }
      }
    });
  }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.contactId;

    this.initForm();

    if (this.isEditMode && this.contactId) {
      this.tryLoadContact();
    } else {
      this.addPhone();
    }
  }

  private tryLoadContact(maxRetries: number = 10, currentRetry: number = 0): void {
    const contact = this.contactService.getContactById(this.contactId!);
    if (contact) {
      this.loadContact(this.contactId!);
      this.contactLoaded = true;
      return;
    }

    if (currentRetry < maxRetries) {
      setTimeout(() => {
        if (!this.contactLoaded) {
          this.tryLoadContact(maxRetries, currentRetry + 1);
        }
      }, 200);
    } else {
      console.error(`Failed to load contact with ID ${this.contactId} after ${maxRetries} attempts`);
      this.router.navigate(['/']);
    }
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phones: this.fb.array([])
    });
  }

  get phonesFormArray(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  createPhoneFormGroup(phone?: Phone): FormGroup {
    return this.fb.group({
      id: [phone?.id || this.contactService.generatePhoneId()],
      number: [phone?.number || '', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]+$/)]],
      type: [phone?.type || 'mobile']
    });
  }

  addPhone(phone?: Phone): void {
    this.phonesFormArray.push(this.createPhoneFormGroup(phone));
  }

  removePhone(index: number): void {
    if (this.phonesFormArray.length > 1) {
      this.phonesFormArray.removeAt(index);
    }
  }

  loadContact(id: string): void {
    const contact = this.contactService.getContactById(id);
    if (!contact) {
      console.warn(`Contact with ID ${id} not found`);
      setTimeout(() => {
        const retryContact = this.contactService.getContactById(id);
        if (retryContact) {
          this.populateForm(retryContact);
        } else {
          this.router.navigate(['/']);
        }
      }, 100);
      return;
    }

    this.populateForm(contact);
  }

  private populateForm(contact: Contact): void {
    this.contactForm.patchValue({
      name: contact.name,
      email: contact.email
    });

    this.phonesFormArray.clear();
    if (contact.phones && contact.phones.length > 0) {
      contact.phones.forEach(phone => {
        this.addPhone(phone);
      });
    } else {
      this.addPhone();
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      
      const contactData: Contact = {
        id: this.contactId || '',
        name: formValue.name.trim(),
        email: formValue.email.trim(),
        phones: formValue.phones.filter((p: Phone) => p.number.trim() !== '')
      };

      if (this.isEditMode && this.contactId) {
        this.contactService.updateContact(this.contactId, contactData);
      } else {
        this.contactService.createContact({
          name: contactData.name,
          email: contactData.email,
          phones: contactData.phones
        });
      }

      this.router.navigate(['/']);
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
      
      this.phonesFormArray.controls.forEach(control => {
        control.get('number')?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    if (this.contactForm.dirty) {
      if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.')) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    
    if (field?.hasError('required') && field.touched) {
      return 'Este campo es obligatorio';
    }
    
    if (field?.hasError('email') && field.touched) {
      return 'Ingresa un email válido';
    }
    
    if (field?.hasError('minlength') && field.touched) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    
    return '';
  }

  getPhoneError(index: number): string {
    const phoneControl = this.phonesFormArray.at(index).get('number');
    
    if (phoneControl?.hasError('required') && phoneControl.touched) {
      return 'El número de teléfono es obligatorio';
    }
    
    if (phoneControl?.hasError('pattern') && phoneControl.touched) {
      return 'Formato de teléfono inválido';
    }
    
    return '';
  }
}
