import React from "react";
import { Card, CardMedia, Typography, Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";


const SamaVedaCard = () => {
  return (
    <Box
    sx={{
        display: { xs: "none", sm: "flex" }, // Hides on extra small screens (xs)
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
      
    >
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -50, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            
            borderRadius: "50%",
            filter: "blur(2px)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Expanding Golden Aura */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
        //   background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(0,0,0,0) 80%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* 3D Tilt Effect Card */}
      <Tilt options={{ max: 25, scale: 1.1 }}>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 150 }}>
          <Card
            sx={{
              width: "400px",
              borderRadius: "16px",
              boxShadow: "0px 8px 20px rgba(255, 215, 0, 0.5)",
              position: "relative",
              overflow: "hidden",
              zIndex: 2,
              transform: "perspective(1000px)",
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image="https://vedicfeed.com/wp-content/uploads/2018/06/Capture.jpg"
              alt="Sama Veda"
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </motion.div>
      </Tilt>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "20px",
            fontSize: "2.5rem",
            background: "linear-gradient(90deg, #8B0000, #FF1493, #C71585)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          सामवेद
        </Typography>
      </motion.div>

      {/* Animated Button */}
      <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 150 }}>
        <Button
          variant="contained"
          sx={{
            marginTop: "20px",
            padding: "12px 24px",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#9333ea !important",
            color: "#fff",
            borderRadius: "30px",
            boxShadow: "0px 4px 15px rgba(147, 51, 234, 0.5)",
            "&:hover": { backgroundColor: "#7e22ce !important" },
          }}
        >
          <a href="https://en.wikipedia.org/wiki/Samaveda">Learn more</a>
        </Button>
      </motion.div>
    </Box>
  );
};

export default SamaVedaCard;
