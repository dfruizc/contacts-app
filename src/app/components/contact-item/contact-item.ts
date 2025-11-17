import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input({ required: true }) contact!: Contact;
  @Output() edit = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.contact);
  }

  onDelete(): void {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${this.contact.name}?`)) {
      this.delete.emit(this.contact.id);
    }
  }
}
