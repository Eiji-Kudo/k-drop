import { aespaQuizzes } from "./quizzes-aespa";
import { leSserafimQuizzes } from "./quizzes-le-sserafim";
import { newjeansQuizzes } from "./quizzes-newjeans";
import type { Quiz } from "./types";

export const quizzes: Quiz[] = [...leSserafimQuizzes, ...newjeansQuizzes, ...aespaQuizzes];
