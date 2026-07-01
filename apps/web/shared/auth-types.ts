export type ConsoleUser = {
  id: string;
  email: string;
  name: string;
  role: string | null;
};

export type ConsoleAuthState =
  | { status: "authenticated"; user: ConsoleUser }
  | { status: "unauthenticated"; user: null };

export type AdminAuthState =
  | { status: "authenticated"; user: ConsoleUser }
  | { status: "forbidden"; user: ConsoleUser }
  | { status: "unauthenticated"; user: null };
