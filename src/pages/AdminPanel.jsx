import { useState, useEffect } from "react";
import {
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getIslands,
  seedIslands,
  seedChallenges,
  seedMissions,
} from "../firebase/firestore";
import { toast } from "react-toastify";

const EMPTY_FORM = {
  islandId: "1",
  title: "",
  description: "",
  difficulty: "Easy",
  points: 100,
  starterCode: "",
  hint: "",
};

export default function AdminPanel() {
  const [challenges, setChallenges] = useState([]);
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const [c, i] = await Promise.all([getChallenges(), getIslands()]);
    setChallenges(c);
    setIslands(i);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateChallenge(editingId, form);
        toast.success("Challenge updated!");
      } else {
        await createChallenge(form);
        toast.success("Challenge created!");
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleEdit = (challenge) => {
    setEditingId(challenge.id);
    setForm({
      islandId: challenge.islandId || "1",
      title: challenge.title || "",
      description: challenge.description || "",
      difficulty: challenge.difficulty || "Easy",
      points: challenge.points || 100,
      starterCode: challenge.starterCode || "",
      hint: challenge.hint || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this challenge?")) return;
    try {
      await deleteChallenge(id);
      toast.success("Challenge deleted!");
      await load();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleSeed = async (type) => {
    try {
      if (type === "islands") await seedIslands();
      if (type === "challenges") await seedChallenges();
      if (type === "missions") await seedMissions();
      toast.success(`${type} seeded!`);
      await load();
    } catch (err) {
      toast.error("Seed error: " + err.message);
    }
  };

  if (loading) return <div className="page-loading">Loading admin panel...</div>;

  const getIslandName = (id) => islands.find((i) => i.id === id)?.name || `Island ${id}`;

  return (
    <div className="admin-panel">
      <h1>⚙️ Captain's Quarters (Admin)</h1>

      {/* Seed buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn-admin create" onClick={() => handleSeed("islands")}>
          Seed Islands
        </button>
        <button className="btn-admin create" onClick={() => handleSeed("challenges")}>
          Seed Challenges
        </button>
        <button className="btn-admin create" onClick={() => handleSeed("missions")}>
          Seed Missions
        </button>
      </div>

      {/* Challenge Form */}
      <h2 className="section-title">
        {editingId ? "✏️ Edit Challenge" : "➕ Create Challenge"}
      </h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Island</label>
        <select name="islandId" value={form.islandId} onChange={handleChange}>
          {islands
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((isl) => (
              <option key={isl.id} value={isl.id}>{isl.name}</option>
            ))}
          {islands.length === 0 && <option value="1">Island 1</option>}
        </select>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required placeholder="Challenge title" />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Describe the challenge..." rows={3} />

        <label>Difficulty</label>
        <select name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
          <option>Legendary</option>
        </select>

        <label>Points</label>
        <input name="points" type="number" value={form.points} onChange={handleChange} min={10} />

        <label>Starter Code</label>
        <textarea name="starterCode" value={form.starterCode} onChange={handleChange} placeholder="Starter code template..." rows={3} />

        <label>Hint</label>
        <input name="hint" value={form.hint} onChange={handleChange} placeholder="Optional hint" />

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <button type="submit" className="btn-admin create">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" className="btn-admin edit" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Challenge Table */}
      <h2 className="section-title">📋 All Challenges ({challenges.length})</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Island</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c) => (
              <tr key={c.id}>
                <td>{getIslandName(c.islandId)}</td>
                <td>{c.title}</td>
                <td>
                  <span className={`difficulty-badge ${c.difficulty?.toLowerCase()}`}>
                    {c.difficulty}
                  </span>
                </td>
                <td>💰 {c.points}</td>
                <td>
                  <button className="btn-admin edit" onClick={() => handleEdit(c)}>Edit</button>
                  <button className="btn-admin delete" onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {challenges.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", opacity: 0.6 }}>
                  No challenges yet. Seed some or create one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
