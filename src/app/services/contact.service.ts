import { Injectable, signal } from '@angular/core';
import { Contact } from '../models/contact.model';

const STORAGE_KEY = 'contacts-app-data';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts = signal<Contact[]>([]);
  public readonly contacts$ = this.contacts.asReadonly();

  constructor() {
    this.loadContacts();
  }

  private async loadContacts(): Promise<void> {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.contacts.set(parsed);
      } catch (error) {
        console.error('Error loading contacts from localStorage:', error);
        await this.loadFromJSON();
      }
    } else {
      await this.loadFromJSON();
    }
  }

  private async loadFromJSON(): Promise<void> {
    try {
      const response = await fetch('/contacts.json');
      const data: Contact[] = await response.json();
      this.contacts.set(data);
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error loading contacts from JSON:', error);
      this.contacts.set([]);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.contacts()));
  }

  getContacts(): Contact[] {
    return this.contacts();
  }

  getContactById(id: string): Contact | undefined {
    return this.contacts().find(contact => contact.id === id);
  }

  createContact(contact: Omit<Contact, 'id'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: this.generateId()
    };

    this.contacts.update(contacts => [...contacts, newContact]);
    this.saveToLocalStorage();
    return newContact;
  }

  updateContact(id: string, contact: Partial<Contact>): boolean {
    const index = this.contacts().findIndex(c => c.id === id);

    if (index === -1) {
      return false;
    }

    this.contacts.update(contacts => {
      const updated = [...contacts];
      updated[index] = { ...updated[index], ...contact };
      return updated;
    });

    this.saveToLocalStorage();
    return true;
  }

  deleteContact(id: string): boolean {
    const index = this.contacts().findIndex(c => c.id === id);

    if (index === -1) {
      return false;
    }

    this.contacts.update(contacts => contacts.filter(c => c.id !== id));
    this.saveToLocalStorage();
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  generatePhoneId(): string {
    return 'phone-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
