import { motion } from "framer-motion";

export default function Avatar({ position }) {
  return (
    <motion.div
      className="avatar-pirate"
      animate={{ left: position.x, top: position.y }}
      transition={{ type: "spring", stiffness: 80, damping: 14, duration: 1 }}
    >
      🏴‍☠️
    </motion.div>
  );
}
