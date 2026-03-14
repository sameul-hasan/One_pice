import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TreasureChest({ points, onClose }) {
  const [opened, setOpened] = useState(false);

  const sparkles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const rad = (angle * Math.PI) / 180;
    const dist = 60 + Math.random() * 40;
    return {
      id: i,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist,
      delay: Math.random() * 0.3,
    };
  });

  return (
    <motion.div
      className="treasure-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="treasure-chest-container"
        onClick={(e) => {
          e.stopPropagation();
          setOpened(true);
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
      >
        <div className="treasure-chest-icon">
          {opened ? "✨" : "🧰"}
        </div>

        {opened && (
          <>
            <div className="treasure-sparkles">
              {sparkles.map((s) => (
                <motion.div
                  key={s.id}
                  className="sparkle"
                  initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: s.tx, y: s.ty, scale: 0 }}
                  transition={{ duration: 1.2, delay: s.delay }}
                />
              ))}
            </div>

            <motion.div
              className="treasure-reward-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              +{points} Bounty Points!
            </motion.div>

            <div className="treasure-coins">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="coin"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  🪙
                </motion.span>
              ))}
            </div>

            <motion.button
              className="btn-close-popup"
              style={{ marginTop: "1.5rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onClose}
            >
              Claim Treasure!
            </motion.button>
          </>
        )}

        {!opened && (
          <motion.p
            style={{ color: "var(--gold)", fontFamily: "var(--font-medieval)", marginTop: "1rem" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Tap to open!
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
