import { Injectable, signal } from '@angular/core';
import { Contact } from '../models/contact.model';

const STORAGE_KEY = 'contacts-app-data';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // Signal para almacenar los contactos (reactivo)
  private contacts = signal<Contact[]>([]);

  // Signal de solo lectura para que los componentes puedan suscribirse
  public readonly contacts$ = this.contacts.asReadonly();

  constructor() {
    // Al iniciar el servicio, cargar los contactos
    this.loadContacts();
  }

  /**
   * Carga los contactos desde localStorage o desde el archivo JSON inicial
   */
  private async loadContacts(): Promise<void> {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      // Si hay datos en localStorage, se utilizan
      try {
        const parsed = JSON.parse(stored);
        this.contacts.set(parsed);
      } catch (error) {
        console.error('Error al cargar contactos desde localStorage:', error);
        await this.loadFromJSON();
      }
    } else {
      // Si no hay datos, cargamos desde el JSON
      await this.loadFromJSON();
    }
  }

  /**
   * Carga los contactos iniciales desde el archivo JSON
   */
  private async loadFromJSON(): Promise<void> {
    try {
      const response = await fetch('/contacts.json');
      const data: Contact[] = await response.json();
      this.contacts.set(data);
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error al cargar contactos desde JSON:', error);
      this.contacts.set([]);
    }
  }

  /**
   * Guarda los contactos en localStorage
   */
  private saveToLocalStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.contacts()));
  }

  /**
   * Obtiene todos los contactos
   */
  getContacts(): Contact[] {
    return this.contacts();
  }

  /**
   * Obtiene un contacto por ID
   */
  getContactById(id: string): Contact | undefined {
    return this.contacts().find(contact => contact.id === id);
  }

  /**
   * Crea un nuevo contacto
   */
  createContact(contact: Omit<Contact, 'id'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: this.generateId()
    };

    this.contacts.update(contacts => [...contacts, newContact]);
    this.saveToLocalStorage();
    return newContact;
  }

  /**
   * Actualiza un contacto existente
   */
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

  /**
   * Elimina un contacto
   */
  deleteContact(id: string): boolean {
    const index = this.contacts().findIndex(c => c.id === id);

    if (index === -1) {
      return false;
    }

    this.contacts.update(contacts => contacts.filter(c => c.id !== id));
    this.saveToLocalStorage();
    return true;
  }

  /**
   * Genera un ID único para nuevos contactos
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Genera un ID único para números de teléfono
   */
  generatePhoneId(): string {
    return 'phone-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
