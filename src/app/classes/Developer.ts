export class Developer {
  name: string;
  title: string;
  image: string | null;
  description?: string | null;

  constructor(name: string, title: string, image: string | null = null, description: string | null = null) {
    this.name = name;
    this.title = title;
    this.image = image;
    this.description = description;
  }

  getLinkedInUrl(): string {
    return "Linkedin clicked!";
  }

  getEmailUrl(): string {
    return "Email clicked!";
  }
}