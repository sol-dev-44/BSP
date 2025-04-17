import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Box, 
  Button, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Toolbar, 
  Tooltip, 
  useMediaQuery 
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store.ts";
import { toggleNavMenu, setCurrentRoute } from "../redux/slices/navSlice.ts";
import { Theme } from "@mui/material/styles";

// Define our color constants
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const TEAL = "#40E0D0"; // Vibrant teal for water theme
const WHITE = "#FFFFFF"; // White for text and contrast

// Motion components
const MotionAppBar = motion(AppBar);
const MotionButton = motion(Button);

const HeroButton = styled(MotionButton)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  letterSpacing: "0.1em",
}));

// Animation variants
const buttonHover = {
  hover: {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

interface NavbarProps {
  theme: any;
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { scrollY } = useScroll();
  
  // Get mobileOpen state from Redux
  const mobileOpen = useSelector((state: RootState) => state.nav.mobileMenuOpen);
  const currentRoute = useSelector((state: RootState) => state.nav.currentRoute);
  
  // Update current route when location changes
  useEffect(() => {
    dispatch(setCurrentRoute(location.pathname));
  }, [location, dispatch]);
  
  // Parallax effect for navbar
  const opacityNavbar = useTransform(scrollY, [0, 100], [0, 1]);

  // Monitor scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      if ((window as any).scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    dispatch(toggleNavMenu());
  };

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  const drawerWidth = 240;

  const navigationItems = [
    { text: "Home", path: "/" },
    // { text: "Parasailing", path: "/parasailing" },
    { text: "Learn More", path: "/learn-more" },
    { text: "Book Now", path: "/book", isBooking: true }
  ];

  const drawer = (
    <Paper sx={{ height: "100%", bgcolor: "rgba(0, 0, 0, 0.9)" }}>
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            component="div"
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
            sx={{ 
              cursor: 'pointer',
              backgroundColor: isActive(item.path) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: isActive(item.path) ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            {item.isBooking ? (
              <Tooltip title="Dates coming soon" arrow placement="right">
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      letterSpacing: "0.1em",
                      textAlign: "center",
                      color: YELLOW,
                      fontWeight: isActive(item.path) ? 700 : 400,
                    },
                  }}
                />
              </Tooltip>
            ) : (
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    letterSpacing: "0.1em",
                    textAlign: "center",
                    color: isActive(item.path) ? YELLOW : WHITE,
                    fontWeight: isActive(item.path) ? 700 : 400,
                  },
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <>
      <MotionAppBar 
        position="fixed" 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          background: scrolled 
            ? "rgba(0, 0, 0, 0.8)" 
            : "rgba(0, 0, 0, 0.4)",
          transition: "background 0.3s ease"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box 
                component="img" 
                src="/MM-Logo-1.png" 
                alt="Mellow Montana Logo" 
                sx={{ 
                  height: 40, 
                  mr: 2,
                  display: { xs: "none", sm: "block" }
                }} 
              />
              <motion.div 
                // sx={{
                //   letterSpacing: "0.2em",
                //   fontWeight: 600,
                //   color: YELLOW,
                // }}
                className="text-lg md:text-xl font-semibold tracking-wider"
                style={{ color: YELLOW }}
              >
                MELLOW MONTANA WATERSPORTS
              </motion.div>
            </Box>
          </motion.div>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              component={motion.button}
              whileTap={{ scale: 0.95 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-6"
            >
              {navigationItems.map((item) => 
                item.isBooking ? (
                  <Tooltip key={item.text} title="Dates coming soon" arrow placement="bottom">
                    <HeroButton
                      variant="contained"
                      color="primary"
                      whileHover={buttonHover.hover}
                      whileTap={{ scale: 0.95 }}
                      initial={{ scale: 1 }}
                      sx={{
                        "&:hover": {
                          bgcolor: "#E6C200", // Slightly darker yellow on hover
                        },
                      }}
                      // onClick={() => navigate(item.path)}
                    >
                      {item.text}
                    </HeroButton>
                  </Tooltip>
                ) : (
                  <MotionButton 
                    key={item.text}
                    color="inherit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: isActive(item.path) ? YELLOW : WHITE,
                      fontWeight: isActive(item.path) ? 700 : 400,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: isActive(item.path) ? '50%' : '0%',
                        height: '2px',
                        bottom: '0',
                        left: '25%',
                        backgroundColor: YELLOW,
                        transition: 'width 0.3s ease',
                      }
                    }}
                  >
                    {item.text}
                  </MotionButton>
                )
              )}
            </motion.div>
          )}
        </Toolbar>
      </MotionAppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;