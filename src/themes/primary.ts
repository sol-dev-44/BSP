import { createTheme } from "@mui/material/styles";

// Define our color constants
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const TEAL = "#40E0D0"; // Vibrant teal for water theme
const DEEP_TEAL = "#008080"; // Deeper teal for accents and contrast
const WHITE = "#FFFFFF"; // White for text and contrast
const SAND = "#F5F5DC"; // Light sand color for subtle elements

// Create theme with Material UI
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: YELLOW,
    },
    secondary: {
      main: TEAL,
    },
    background: {
      default: "#121212",
      paper: "rgba(0, 0, 0, 0.7)",
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    h1: {
      fontSize: "4rem",
      fontWeight: 700,
      letterSpacing: "0.2em",
      color: WHITE,
      [createTheme().breakpoints.down("md")]: {
        fontSize: "2.5rem",
      },
    },
    h4: {
      fontWeight: 300,
      letterSpacing: "0.15em",
      color: SAND,
    },
    h6: {
      color: YELLOW,
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        },
        contained: {
          backgroundColor: YELLOW,
          color: "#000000",
          "&:hover": {
            backgroundColor: "#E6C200",
          },
        },
        outlined: {
          borderColor: WHITE,
          color: WHITE,
          "&:hover": {
            borderColor: WHITE,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  },
});

// Export color constants so they can be used throughout the app
export { YELLOW, TEAL, DEEP_TEAL, WHITE, SAND };

export default theme;