import { motion } from "framer-motion";

const CREW_DATA = {
  Luffy: { icon: "👒", title: "Captain", quote: "I'm gonna be King of the Pirates!" },
  Zoro: { icon: "⚔️", title: "Swordsman", quote: "Nothing happened." },
  Nami: { icon: "🗺️", title: "Navigator", quote: "Happiness Punch!" },
  Usopp: { icon: "🎯", title: "Sniper", quote: "I am Captain Usopp!" },
  Sanji: { icon: "🍳", title: "Cook", quote: "A real man forgives a woman for her lies." },
  Robin: { icon: "📚", title: "Archaeologist", quote: "I want to live!" },
  "One Piece": { icon: "👑", title: "The Treasure", quote: "The greatest treasure of all!" },
};

export default function CrewPopup({ member, onClose }) {
  if (!member) return null;
  const data = CREW_DATA[member] || { icon: "🏴‍☠️", title: "Crew Member", quote: "Ahoy!" };

  return (
    <motion.div
      className="crew-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="crew-popup"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-icon">{data.icon}</div>
        <h2>{member} has joined your crew!</h2>
        <p>"{data.quote}"</p>
        <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>Role: {data.title}</p>
        <button className="btn-close-popup" onClick={onClose}>
          Welcome Aboard!
        </button>
      </motion.div>
    </motion.div>
  );
}
