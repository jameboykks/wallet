import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";

const AnimatedCard = ({ children, onClick }) => {
  const [springProps, setSpringProps] = useSpring(() => ({
    scale: 1,
    config: { mass: 1, tension: 300, friction: 20 },
  }));

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <animated.div style={springProps}>{children}</animated.div>
    </motion.div>
  );
};

export default AnimatedCard; 