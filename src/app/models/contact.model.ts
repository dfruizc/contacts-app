export interface Phone {
  id: string;
  type: string;   // ej: "mobile", "home", "work"
  number: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phones: Phone[];
}

