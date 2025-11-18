export interface Phone {
  id: string;
  type: string;
  number: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phones: Phone[];
}

