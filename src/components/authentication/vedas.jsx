import React from "react";
import { motion } from "framer-motion";
import "./ImageFrame.css"; // Import CSS for styling

const ImageFrame = () => {
  return (
    <div className="container">
      {/* Animated Frame with Floating Effect */}
      <motion.div
        className="image-frame"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, rotate: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image with Floating Effect */}
        <motion.img
          src="https://i.pinimg.com/736x/66/99/b5/6699b5c6934f090a7cfffd43f387af24.jpg"
          alt="Vedic Scholar"
          className="image"
          animate={{
            y: [0, -5, 0], // Floating effect
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Animated Quote Section */}
      <motion.p
        className="quote"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
        whileHover={{ scale: 1.05, color: "#ffdd57" }}
      >
        "Follow Indian Vedas, not foreign. Develop India."
      </motion.p>
    </div>
  );
};

export default ImageFrame;
