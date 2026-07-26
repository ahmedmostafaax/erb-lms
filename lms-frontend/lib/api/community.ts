import { apiFetch } from "./client";

type Author = { name: string; avatarUrl?: string };

export type Comment = { _id: string; user: Author; content: string; createdAt: string };
export type Post = {
  _id: string;
  user: Author;
  content: string;
  comments: Comment[];
  createdAt: string;
};

export type Answer = { _id: string; user: Author; body: string; isAccepted: boolean; createdAt: string };
export type Question = {
  _id: string;
  user: Author;
  title: string;
  body: string;
  answers: Answer[];
  createdAt: string;
};

export function getCoursePosts(courseId: string) {
  return apiFetch<{ status: string; data: Post[] }>(`/community/posts/course/${courseId}`);
}

export function createPost(courseId: string, content: string, token: string) {
  return apiFetch<{ status: string; data: Post }>("/community/posts", {
    method: "POST",
    body: { courseId, content },
    token,
  });
}

export function addComment(postId: string, content: string, token: string) {
  return apiFetch<{ status: string; data: Comment }>(`/community/posts/${postId}/comments`, {
    method: "POST",
    body: { content },
    token,
  });
}

export function getCourseQuestions(courseId: string) {
  return apiFetch<{ status: string; data: Question[] }>(`/community/questions/course/${courseId}`);
}

export function createQuestion(
  courseId: string,
  payload: { title: string; body: string },
  token: string
) {
  return apiFetch<{ status: string; data: Question }>("/community/questions", {
    method: "POST",
    body: { courseId, ...payload },
    token,
  });
}

export function addAnswer(questionId: string, body: string, token: string) {
  return apiFetch<{ status: string; data: Answer }>(`/community/questions/${questionId}/answers`, {
    method: "POST",
    body: { body },
    token,
  });
}
