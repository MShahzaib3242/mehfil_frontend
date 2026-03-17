import { motion } from "framer-motion";

function Loader({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
      style={{
        width: size,
        height: size,
      }}
      className="border-2 border-white border-t-transparent rounded-full"
    />
  );
}

export default Loader;
