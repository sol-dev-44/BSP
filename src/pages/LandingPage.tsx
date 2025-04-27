import React, { FC, useEffect, useState } from "react";
import { Box, Container, Grid, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import { motion, useScroll, useTransform } from "framer-motion";
import { Tooltip } from "@mui/material";
// Import theme
import theme, { YELLOW, TEAL, WHITE, SAND } from "../themes/primary.ts";

// Motion components for our MUI elements
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionBox = motion(Box);
const MotionButton = motion(motion.button);

const HeroBackground = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url("/FlatheadAerial1.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: -1,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
}));

const HeroButton = styled(MotionButton)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2, 6),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
}));

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};


const slideUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const buttonHover = {
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

const LandingPage: FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  // Parallax effect for background
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Parallax Background */}
      <MotionBox
        style={{ y: backgroundY }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <HeroBackground />
      </MotionBox>

      {/* Main Content */}
      <MotionContainer
        maxWidth="lg"
        sx={{
          pt: { xs: 8, md: 20 }, // Reduced top padding on mobile
          pb: 8,
          minHeight: "90vh", // Reduced from 100vh to ensure buttons don't go too low
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }} >
            <MotionTypography
              variant={isMobile ? "h2" : "h1"} // Smaller heading on mobile
              gutterBottom
              variants={slideUp}
              sx={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                fontSize: { xs: "2.5rem", md: "3.5rem" }, // Custom font size for better control
              }}
            >
              DISCOVER CLARITY
            </MotionTypography>
            <MotionTypography
              variant="h4"
              gutterBottom
              variants={slideUp}
              sx={{
                mb: { xs: 3, md: 6 }, // Less margin on mobile
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                fontSize: { xs: "1.5rem", md: "2.125rem" }, // Smaller on mobile
              }}
            >
              ABOVE FLATHEAD LAKE
            </MotionTypography>
            <MotionBox
              sx={{ 
                display: "flex", 
                gap: 3, 
                flexWrap: { xs: "wrap", md: "nowrap" },
                mb: { xs: 6, md: 0 } // Add bottom margin on mobile to ensure buttons aren't too low
              }}
              variants={fadeIn}
            >
              <Tooltip title="Dates coming soon" arrow placement="bottom">
                <HeroButton
                  style={{ 
                    backgroundColor: YELLOW,
                    color: "#000000"
                  }}
                  whileHover={buttonHover.hover}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 1 }}
                  // onClick={() => navigate("/book")}
                >
                  BOOK YOUR ADVENTURE
                </HeroButton>
              </Tooltip>
              <HeroButton
                onClick={() => navigate("/about")}
                style={{
                  borderColor: WHITE,
                  color: WHITE,
                  backgroundColor: "transparent",
                  border: `2px solid ${WHITE}`,
                }}
                whileHover={buttonHover.hover}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 1 }}
              >
                LEARN MORE
              </HeroButton>
            </MotionBox>

            {/* Floating parasail icon */}
            <MotionBox
              sx={{
                position: "absolute",
                right: { xs: "10%", md: "5%" },
                top: { xs: "70%", md: "80%" }, // Moved up on mobile
                opacity: 0.8,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
            >
              <img src="/MM-Logo-1.png" alt="Parasail Icon" width="100" />
            </MotionBox>
          </Grid>
        </Grid>
      </MotionContainer>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ position: "fixed", bottom: 0, width: "100%" }}
      >
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          sx={{
            width: "100%",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            py: 3,
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid>
                {/* Empty for balance */}
              </Grid>

              <Grid>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  style={{ 
                    color: SAND, 
                    opacity: 0.8,
                    margin: 0,
                    fontSize: '0.875rem'
                  }}
                >
                  © 2025 BIG SKY PARASAIL CO.
                </motion.p>
              </Grid>
            </Grid>
          </Container>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default LandingPage;