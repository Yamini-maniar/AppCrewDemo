export type User = {
  id: number;
  email: string;
};

export type Note = {
  id: number;
  title: string;
  content: string | null;
  user_id: number; // Changed from string to number
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User & { password?: string; created_at: string };
        Insert: Omit<User, 'id'> & { password?: string; created_at?: string };
        Update: Partial<Omit<User, 'id'>>;
      };
      notes: {
        Row: Note;
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Note, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};

export type ParamList = {
  Login: undefined;
  SignUp: undefined;
  Auth: undefined;
  Home: undefined;
  CreateNote: undefined;
  EditNote: { note: Note };
};
