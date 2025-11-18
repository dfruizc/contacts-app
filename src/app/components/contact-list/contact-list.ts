import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ContactItem } from '../contact-item/contact-item';
import { Contact } from '../../interfaces/contact.interface';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ContactItem],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  
  contacts: Contact[] = [];

  constructor() {
    effect(() => {
      this.contacts = this.contactService.contacts$();
    });
  }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
  }

  onEdit(contact: Contact): void {
    this.router.navigate(['/contact/edit', contact.id]);
  }

  onDelete(contactId: string): void {
    this.contactService.deleteContact(contactId);
  }
}
