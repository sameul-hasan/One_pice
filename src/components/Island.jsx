import { motion } from "framer-motion";

export default function Island({ island, status, onClick, style }) {
  const icons = {
    1: "🏘️",
    2: "🍽️",
    3: "☁️",
    4: "🔧",
    5: "🐟",
    6: "🌳",
    7: "👑",
  };

  const statusClass =
    status === "completed" ? "completed" : status === "current" ? "current" : "locked";

  return (
    <motion.div
      className={`island-node ${statusClass}`}
      style={style}
      onClick={status !== "locked" ? onClick : undefined}
      whileHover={status !== "locked" ? { scale: 1.15 } : {}}
      whileTap={status !== "locked" ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (island.order || 1) * 0.1 }}
    >
      <span className="island-icon">{icons[island.order] || "🏝️"}</span>
      <span className="island-label">{island.name}</span>
    </motion.div>
  );
}
