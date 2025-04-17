import React, { useState, useEffect, useRef } from "react";
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
  useMediaQuery,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon, KeyboardArrowDown } from "@mui/icons-material";
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

// Parasailing dropdown menu items
const parasailingMenuItems = [
  { text: "The Experience", path: "/parasailing#experience" },
  { text: "Safety & Requirements", path: "/parasailing#safety" },
  { text: "Our Location", path: "/parasailing#location" },
  { text: "Guest Experiences", path: "/parasailing#testimonials" }
];

interface NavbarProps {
  theme: any;
}

const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const parasailingMenuRef = useRef<HTMLDivElement>(null);
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
    if (path.includes("#")) {
      // For hash routes, check if the base path matches
      const basePath = path.split("#")[0];
      return location.pathname === basePath;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  // Toggle dropdown menu
  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking away
  const handleCloseDropdown = (event: Event | React.SyntheticEvent) => {
    if (
      parasailingMenuRef.current &&
      parasailingMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setDropdownOpen(false);
  };

  // Handle keyboard navigation for dropdown
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setDropdownOpen(false);
    } else if (event.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  // Navigate to section and close mobile menu if open
  const navigateToSection = (path: string) => {
    const [basePath, hash] = path.split("#");
    
    // If we're already on the parasailing page and clicking a section link
    if (location.pathname === "/parasailing" && hash) {
      // Don't navigate, just scroll to the section
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Otherwise navigate to the new page with hash
      navigate(path);
    }
    
    // Close menus
    if (mobileOpen) {
      handleDrawerToggle();
    }
    setDropdownOpen(false);
  };

  const drawerWidth = 240;

  const navigationItems = [
    { text: "Home", path: "/" },
    { text: "Parasailing", path: "/parasailing", hasDropdown: true },
    { text: "Book Now", path: "/book", isBooking: true }
  ];

  // Mobile drawer with expanded parasailing submenu
  const drawer = (
    <Paper sx={{ height: "100%", bgcolor: "rgba(0, 0, 0, 0.9)" }}>
      <List>
        {navigationItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem 
              component="div"
              onClick={() => {
                if (item.hasDropdown) {
                  // Don't navigate or close drawer for parasailing main item
                  return;
                }
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
            
            {/* Show parasailing submenu in mobile view */}
            {item.hasDropdown && (
              <List component="div" disablePadding>
                {parasailingMenuItems.map((subItem) => (
                  <ListItem 
                    key={subItem.text}
                    component="div"
                    onClick={() => navigateToSection(subItem.path)}
                    sx={{ 
                      cursor: 'pointer',
                      pl: 4,
                      backgroundColor: 'rgba(64, 224, 208, 0.05)',
                      '&:hover': {
                        backgroundColor: 'rgba(64, 224, 208, 0.1)',
                      }
                    }}
                  >
                    <ListItemText
                      primary={subItem.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "0.9rem",
                          color: WHITE,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
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
                    >
                      {item.text}
                    </HeroButton>
                  </Tooltip>
                ) : item.hasDropdown ? (
                  // Dropdown menu for Parasailing
                  <div ref={parasailingMenuRef} key={item.text}>
                    <MotionButton 
                      color="inherit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleDropdown}
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
                      endIcon={<KeyboardArrowDown style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />}
                    >
                      {item.text}
                    </MotionButton>
                    <Popper
                      open={dropdownOpen}
                      anchorEl={parasailingMenuRef.current}
                      role={undefined}
                      placement="bottom-start"
                      transition
                      disablePortal
                      style={{ zIndex: 1300 }}
                    >
                      {({ TransitionProps }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin: 'top center',
                          }}
                        >
                          <Paper sx={{ 
                            mt: 1, 
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            minWidth: 200
                          }}>
                            <ClickAwayListener onClickAway={handleCloseDropdown}>
                              <MenuList
                                autoFocusItem={dropdownOpen}
                                id="parasailing-menu"
                                aria-labelledby="parasailing-button"
                                onKeyDown={handleListKeyDown}
                              >
                                {parasailingMenuItems.map((subItem) => (
                                  <MenuItem 
                                    key={subItem.text} 
                                    onClick={() => navigateToSection(subItem.path)}
                                    sx={{ 
                                      color: WHITE,
                                      '&:hover': {
                                        backgroundColor: 'rgba(64, 224, 208, 0.1)',
                                        color: YELLOW
                                      }
                                    }}
                                  >
                                    {subItem.text}
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </div>
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