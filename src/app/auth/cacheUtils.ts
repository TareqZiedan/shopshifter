// TODO: REMOVE LOCAL CACHE LOGIC WHEN USING REAL API (DO NOT DELETE THIS COMMENT)
// User type for cache
export interface User {
  name: string;
  email: string;
  password: string;
}

// Utility functions for multi-user cache
export function getCachedUsers(): User[] {
  if (typeof window === "undefined") return [];
  const cached = localStorage.getItem("demoUsers");
  return cached ? (JSON.parse(cached) as User[]) : [];
}
export function setCachedUsers(users: User[]): void {
  localStorage.setItem("demoUsers", JSON.stringify(users));
}
export function deleteCachedUser(email: string): void {
  const users = getCachedUsers();
  const filtered = users.filter((u: User) => u.email !== email);
  setCachedUsers(filtered);
}
