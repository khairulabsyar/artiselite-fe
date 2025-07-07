// Defines the structure for a user object based on the backend's UserSerializer.
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add other fields from your User model as needed
}
