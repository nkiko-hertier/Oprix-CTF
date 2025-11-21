"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Edit, Trash2, Save, X, Upload, Lightbulb } from "lucide-react";
import { GradientCard } from "@/components/HomeCards";
import getApiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api.config";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NoContent from "@/components/NoContent";
import type { Challenge, Hint } from "@/types";

function ChallengeManagement() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    points: 100,
    difficulty: "MEDIUM" as const,
    flag: "",
    caseSensitive: false,
    normalizeFlag: true,
    isVisible: true,
    url: "",
    timeLimit: null as number | null,
  });
  const [hints, setHints] = useState<Array<{ content: string; cost: number; order: number }>>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (competitionId) {
      fetchChallenges();
    }
  }, [competitionId]);

  const fetchChallenges = async () => {
    if (!competitionId) return;

    try {
      setLoading(true);
      const res = await getApiClient().get(
        API_ENDPOINTS.CHALLENGES.LIST(competitionId)
      );
      setChallenges(res.data || []);
    } catch (error: any) {
      toast.error("Failed to load challenges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!competitionId) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        hints: hints.map((h, i) => ({
          content: h.content,
          cost: h.cost,
          order: i + 1,
        })),
      };

      await getApiClient().post(
        API_ENDPOINTS.CHALLENGES.CREATE(competitionId),
        payload
      );

      toast.success("Challenge created successfully");
      resetForm();
      fetchChallenges();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create challenge");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!competitionId || !editingId) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        hints: hints.map((h, i) => ({
          content: h.content,
          cost: h.cost,
          order: i + 1,
        })),
      };

      await getApiClient().put(
        API_ENDPOINTS.CHALLENGES.UPDATE(competitionId, editingId),
        payload
      );

      toast.success("Challenge updated successfully");
      resetForm();
      fetchChallenges();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update challenge");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (challengeId: string) => {
    if (!competitionId) return;
    if (!window.confirm("Are you sure you want to delete this challenge?")) return;

    try {
      await getApiClient().delete(
        API_ENDPOINTS.CHALLENGES.DELETE(competitionId, challengeId)
      );
      toast.success("Challenge deleted successfully");
      fetchChallenges();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete challenge");
    }
  };

  const startEdit = (challenge: any) => {
    setEditingId(challenge.id);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category || "",
      points: challenge.points,
      difficulty: challenge.difficulty,
      flag: "", // Flag is not returned for security
      caseSensitive: challenge.caseSensitive,
      normalizeFlag: challenge.normalizeFlag,
      isVisible: challenge.isVisible,
      url: challenge.url || "",
      timeLimit: challenge.timeLimit,
    });
    setHints(
      challenge.hints?.map((h:any) => ({
        content: h.content,
        cost: h.cost,
        order: h.order || 0,
      })) || []
    );
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      points: 100,
      difficulty: "MEDIUM",
      flag: "",
      caseSensitive: false,
      normalizeFlag: true,
      isVisible: true,
      url: "",
      timeLimit: null,
    });
    setHints([]);
    setShowCreateForm(false);
    setEditingId(null);
  };

  const addHint = () => {
    setHints([...hints, { content: "", cost: 0, order: hints.length + 1 }]);
  };

  const removeHint = (index: number) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const updateHint = (index: number, field: string, value: string | number) => {
    const updated = [...hints];
    updated[index] = { ...updated[index], [field]: value };
    setHints(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Challenge Management</h1>
          <p className="text-slate-400">Manage challenges for this competition</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/dashboard/competitions"
            className="px-4 py-2 bg-slate-500 hover:bg-slate-600 rounded-md text-white"
          >
            Back to Competitions
          </Link>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white flex items-center gap-2"
            >
              <Plus className="size-4" />
              Create Challenge
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <GradientCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? "Edit Challenge" : "Create New Challenge"}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-white/10 rounded-md text-slate-400"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  placeholder="Challenge Title"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  placeholder="WEB, CRYPTO, PWN, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                rows={4}
                placeholder="Challenge description..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Points</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                >
                  <option value="TRIVIAL">Trivial</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="INSANE">Insane</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={formData.timeLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeLimit: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Flag</label>
              <input
                type="text"
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white font-mono"
                placeholder="Oprix-{flag}"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Challenge URL (optional)</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-slate-400">
                <input
                  type="checkbox"
                  checked={formData.caseSensitive}
                  onChange={(e) => setFormData({ ...formData, caseSensitive: e.target.checked })}
                  className="rounded"
                />
                Case Sensitive
              </label>
              <label className="flex items-center gap-2 text-slate-400">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded"
                />
                Visible
              </label>
            </div>

            {/* Hints Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-400 flex items-center gap-2">
                  <Lightbulb className="size-4" />
                  Hints
                </label>
                <button
                  onClick={addHint}
                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-md text-blue-400 text-sm flex items-center gap-1"
                >
                  <Plus className="size-3" />
                  Add Hint
                </button>
              </div>
              {hints.map((hint, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={hint.content}
                    onChange={(e) => updateHint(index, "content", e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                    placeholder="Hint content"
                  />
                  <input
                    type="number"
                    value={hint.cost}
                    onChange={(e) => updateHint(index, "cost", parseInt(e.target.value))}
                    className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                    placeholder="Cost"
                  />
                  <button
                    onClick={() => removeHint(index)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-red-400"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 rounded-md text-white"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdate : handleCreate}
                disabled={submitting}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="size-4" />
                    {editingId ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </div>
        </GradientCard>
      )}

      {/* Challenges List */}
      {challenges.length === 0 ? (
        <NoContent
          title="No challenges yet"
          description="Create your first challenge to get started"
        />
      ) : (
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <GradientCard key={challenge.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {challenge.points} pts
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {challenge.difficulty}
                    </span>
                    {challenge.category && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        {challenge.category}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {challenge.solveCount !== undefined && (
                      <span>{challenge.solveCount} solves</span>
                    )}
                    {challenge.hints && challenge.hints.length > 0 && (
                      <span>{challenge.hints.length} hint(s)</span>
                    )}
                    {challenge.timeLimit && <span>{challenge.timeLimit} min limit</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => startEdit(challenge)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-md text-blue-400"
                    title="Edit Challenge"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-red-400"
                    title="Delete Challenge"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </GradientCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChallengeManagement;

