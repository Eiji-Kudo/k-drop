export type UserStatus = "active" | "suspended" | "deleted";
export type QuizDifficulty = "easy" | "normal" | "hard";
export type QuizStatus = "draft" | "published" | "archived";
export type Scope = "overall" | "group";
export type EventVisibility = "public" | "private" | "unlisted";
export type ParticipationStatus = "joined" | "waitlisted" | "cancelled";

export const isUserStatus = (value: string): value is UserStatus => value === "active" || value === "suspended" || value === "deleted";
export const isQuizDifficulty = (value: string): value is QuizDifficulty => value === "easy" || value === "normal" || value === "hard";
export const isQuizStatus = (value: string): value is QuizStatus => value === "draft" || value === "published" || value === "archived";
export const isScope = (value: string): value is Scope => value === "overall" || value === "group";
export const isEventVisibility = (value: string): value is EventVisibility => value === "public" || value === "private" || value === "unlisted";
export const isParticipationStatus = (value: string): value is ParticipationStatus =>
	value === "joined" || value === "waitlisted" || value === "cancelled";
