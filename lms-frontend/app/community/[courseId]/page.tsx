"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import {
  getCoursePosts,
  createPost,
  addComment,
  getCourseQuestions,
  createQuestion,
  addAnswer,
  type Post,
  type Question,
} from "@/lib/api/community";
import { ApiError } from "@/lib/api/client";

type Tab = "posts" | "questions";

function timeAgo(dateStr: string, locale: "ar" | "en") {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return locale === "ar" ? "دلوقتي" : "just now";
  if (hours < 24) return locale === "ar" ? `من ${hours} ساعة` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return locale === "ar" ? `من ${days} يوم` : `${days}d ago`;
}

export default function CommunityPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { dict, locale } = useLanguage();
  const { token } = useAuth();

  const [tab, setTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newPost, setNewPost] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const [qTitle, setQTitle] = useState("");
  const [qBody, setQBody] = useState("");
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  const loadPosts = () => getCoursePosts(courseId).then((res) => setPosts(res.data));
  const loadQuestions = () => getCourseQuestions(courseId).then((res) => setQuestions(res.data));

  useEffect(() => {
    loadPosts();
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPost.trim()) return;
    setError(null);
    try {
      await createPost(courseId, newPost, token);
      setNewPost("");
      loadPosts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ");
    }
  };

  const handleAddComment = async (postId: string) => {
    const content = commentDrafts[postId];
    if (!token || !content?.trim()) return;
    try {
      await addComment(postId, content, token);
      setCommentDrafts((d) => ({ ...d, [postId]: "" }));
      loadPosts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ");
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !qTitle.trim() || !qBody.trim()) return;
    setError(null);
    try {
      await createQuestion(courseId, { title: qTitle, body: qBody }, token);
      setQTitle("");
      setQBody("");
      loadQuestions();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ");
    }
  };

  const handleAddAnswer = async (questionId: string) => {
    const body = answerDrafts[questionId];
    if (!token || !body?.trim()) return;
    try {
      await addAnswer(questionId, body, token);
      setAnswerDrafts((d) => ({ ...d, [questionId]: "" }));
      loadQuestions();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ");
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">{dict.community.title}</h1>

        <div className="mt-6 flex gap-2 border-b border-line">
          {(["posts", "questions"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === t ? "border-b-2 border-primary text-primary" : "text-ink/50 hover:text-ink"
              }`}
            >
              {t === "posts" ? dict.community.postsTab : dict.community.questionsTab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4">
            <Alert type="error" message={error} />
          </div>
        )}

        {tab === "posts" ? (
          <div className="mt-6">
            {token && (
              <form onSubmit={handleCreatePost} className="mb-6 space-y-2">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder={dict.community.postPlaceholder}
                  rows={3}
                  className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  {dict.community.publish}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="rounded-2xl border border-line bg-paper-raised p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">{post.user.name}</span>
                    <span className="text-xs text-ink/40">{timeAgo(post.createdAt, locale)}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/80">{post.content}</p>

                  <div className="mt-4 space-y-2 border-t border-line pt-3">
                    {post.comments.map((c) => (
                      <div key={c._id} className="text-sm">
                        <span className="font-medium text-ink">{c.user.name}: </span>
                        <span className="text-ink/70">{c.content}</span>
                      </div>
                    ))}
                  </div>

                  {token && (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={commentDrafts[post._id] || ""}
                        onChange={(e) =>
                          setCommentDrafts((d) => ({ ...d, [post._id]: e.target.value }))
                        }
                        placeholder={dict.community.commentPlaceholder}
                        className="flex-1 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {dict.community.reply}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {posts.length === 0 && (
                <p className="py-8 text-center text-sm text-ink/50">{dict.community.noPosts}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {token && (
              <form onSubmit={handleCreateQuestion} className="mb-6 space-y-2">
                <input
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder={dict.community.questionTitlePlaceholder}
                  className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                <textarea
                  value={qBody}
                  onChange={(e) => setQBody(e.target.value)}
                  placeholder={dict.community.questionBodyPlaceholder}
                  rows={3}
                  className="w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                  {dict.community.askQuestion}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q._id} className="rounded-2xl border border-line bg-paper-raised p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{q.title}</span>
                    <span className="text-xs text-ink/40">{timeAgo(q.createdAt, locale)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/50">{q.user.name}</p>
                  <p className="mt-2 text-sm text-ink/80">{q.body}</p>

                  <div className="mt-4 space-y-2 border-t border-line pt-3">
                    {q.answers.map((a) => (
                      <div key={a._id} className="text-sm">
                        <span className="font-medium text-ink">{a.user.name}: </span>
                        <span className="text-ink/70">{a.body}</span>
                      </div>
                    ))}
                  </div>

                  {token && (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={answerDrafts[q._id] || ""}
                        onChange={(e) => setAnswerDrafts((d) => ({ ...d, [q._id]: e.target.value }))}
                        placeholder={dict.community.answerPlaceholder}
                        className="flex-1 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-primary"
                      />
                      <button
                        onClick={() => handleAddAnswer(q._id)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {dict.community.reply}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {questions.length === 0 && (
                <p className="py-8 text-center text-sm text-ink/50">{dict.community.noQuestions}</p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
