import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart,
  ExitToApp,
  Storefront,
  Add,
  Remove,
  Delete,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RAZORPAY_KEY_ID = "rzp_test_PHxjgAg21bEtu2";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [updatingCartItem, setUpdatingCartItem] = useState(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check if user is admin
  const isAdmin = user?.email === "eshitabhawsar@gmail.com";

  // Load cart from localStorage
  useEffect(() => {
    // Only load cart for non-admin users
    if (!isAdmin) {
      // Function to handle cart updates
      const handleCartUpdate = () => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error("Error loading cart from localStorage", e);
          }
        }
      };

      // Function to handle opening cart drawer
      const handleOpenCartDrawer = () => {
        setCartDrawerOpen(true);
      };

      // Add event listeners
      window.addEventListener("cart-updated", handleCartUpdate);
      window.addEventListener("open-cart-drawer", handleOpenCartDrawer);

      // Initial cart load
      handleCartUpdate();

      // Clean up event listeners
      return () => {
        window.removeEventListener("cart-updated", handleCartUpdate);
        window.removeEventListener("open-cart-drawer", handleOpenCartDrawer);
      };
    }
  }, [isAdmin]); // Depend on isAdmin

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      credentials: "include",
    });
    setUser(null);
    navigate("/");
    setDrawerOpen(false);
    setAccountMenuAnchor(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const cartCount = getCartItemCount();

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setUpdatingCartItem(productId);

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent("cart-updated"));

    setTimeout(() => setUpdatingCartItem(null), 300);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new CustomEvent("cart-updated"));

    if (updatedCart.length === 0) {
      setCartDrawerOpen(false);
    }
  };

  // Razorpay checkout
  const handleCheckout = async () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to checkout",
        severity: "warning",
      });
      return;
    }

    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: "Your cart is empty",
        severity: "info",
      });
      return;
    }

    try {
      setProcessingCheckout(true);

      const totalAmount = getCartTotal();

      // Create order for the entire cart
      const res = await axios.post("http://localhost:5000/api/create-order", {
        amount: totalAmount,
        currency: "INR",
        receipt: `cart_${Date.now()}`,
      });
      const order = res.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "E-Commerce Store",
        description: `Payment for ${cart.length} items`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Save each cart item as a separate order
            await Promise.all(
              cart.map((item) =>
                axios.post("http://localhost:5000/api/save-order", {
                  productId: item._id,
                  userId: user._id,
                  paymentId: response.razorpay_payment_id,
                  amount: item.price * item.quantity,
                  status: "paid",
                })
              )
            );

            setSnackbar({
              open: true,
              message: `Payment successful! Your order has been placed.`,
              severity: "success",
            });

            // Clear the cart after successful payment
            setCart([]);
            localStorage.setItem("cart", JSON.stringify([]));
            window.dispatchEvent(new CustomEvent("cart-updated"));
            setCartDrawerOpen(false);
          } catch (saveError) {
            console.error("Error saving order:", saveError);
            setSnackbar({
              open: true,
              message: "Payment successful but failed to save order details",
              severity: "warning",
            });
          }
        },
        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: "",
        },
        theme: {
          color: "#FF9900",
        },
        modal: {
          ondismiss: function () {
            setProcessingCheckout(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Checkout failed: ${err.response?.data?.error || err.message}`,
        severity: "error",
      });
    } finally {
      setProcessingCheckout(false);
    }
  };

  // Only include cart in navigation items for non-admin users
  const navigationItems = !isAdmin
    ? [
        {
          text: "Cart",
          icon: <ShoppingCart />,
          path: "/cart",
          badge: cartCount,
        },
      ]
    : [];

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        bgcolor: "white",
      }}
      role="presentation"
    >
      {/* User Section */}
      {user && (
        <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={user.photo || (user.photos && user.photos[0]?.value)}
              alt={user.displayName}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                {user.displayName}
              </Typography>
              {isAdmin && (
                <Typography
                  variant="caption"
                  color="primary.main"
                  fontWeight="bold"
                >
                  Administrator
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation Items - Only show for non-admin users */}
      {!isAdmin && navigationItems.length > 0 && (
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.text}
              button
              onClick={() => {
                setCartDrawerOpen(true);
                setDrawerOpen(false);
              }}
              sx={{
                py: 1.5,
              }}
            >
              <ListItemIcon>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      )}

      <Divider />

      {/* Logout */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            sx={{
              textTransform: "none",
              justifyContent: "flex-start",
            }}
          >
            Sign Out
          </Button>
        </Box>
      )}
    </Box>
  );

  // Cart drawer content
  const cartDrawerContent = (
    <Box
      sx={{
        width: { xs: "100%", sm: 400 },
        height: "100%",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "#f5f5f5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
        </Typography>
        <IconButton onClick={() => setCartDrawerOpen(false)}>
          <ArrowForward />
        </IconButton>
      </Box>

      <Divider />

      {cart.length === 0 ? (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <ShoppingCart
            sx={{ fontSize: 48, color: "#ccc", mb: 2, mx: "auto" }}
          />
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added anything to your cart yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setCartDrawerOpen(false);
              navigate("/");
            }}
            sx={{ alignSelf: "center" }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflowY: "auto", p: 0 }}>
            {cart.map((item) => (
              <React.Fragment key={item._id}>
                <ListItem sx={{ py: 2, px: 2 }}>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                        border: "1px solid #eee",
                        borderRadius: 1,
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 0.5, lineHeight: 1.2 }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="primary.main"
                        fontWeight={500}
                      >
                        {formatPrice(item.price)}
                      </Typography>

                      {/* Quantity Controls */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateCartItemQuantity(item._id, item.quantity - 1)
                          }
                          disabled={updatingCartItem === item._id}
                          sx={{ p: 0.5 }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>

                        <Typography
                          sx={{ mx: 1, minWidth: 24, textAlign: "center" }}
                        >
                          {updatingCartItem === item._id ? (
                            <CircularProgress size={16} />
                          ) : (
                            item.quantity
                          )}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() =>
                            updateCartItemQuantity(item._id, item.quantity + 1)
                          }
                          disabled={updatingCartItem === item._id}
                          sx={{ p: 0.5 }}
                        >
                          <Add fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeFromCart(item._id)}
                          sx={{ ml: "auto" }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Subtotal:
              </Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                {formatPrice(getCartTotal())}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#FF9900",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#FA8900",
                },
                mb: 1,
                py: 1.2,
              }}
              onClick={handleCheckout}
              disabled={processingCheckout || cart.length === 0}
              startIcon={
                processingCheckout && (
                  <CircularProgress size={20} color="inherit" />
                )
              }
            >
              {processingCheckout ? "Processing..." : "Checkout"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setCartDrawerOpen(false)}
              sx={{
                borderColor: "#d5d9d9",
                color: "#0F1111",
                "&:hover": {
                  borderColor: "#a2a6a6",
                  backgroundColor: "#f7fafa",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: "white",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: { xs: 60 },
              px: { xs: 1, sm: 2 },
              justifyContent: "space-between",
            }}
          >
            {/* Left Section: Menu + Logo */}
            <Box display="flex" alignItems="center" gap={1}>
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              )}

              {/* Logo */}
              <Box
                display="flex"
                alignItems="center"
                onClick={() => navigate("/")}
                sx={{ cursor: "pointer" }}
              >
                <Storefront sx={{ mr: 1, color: "primary.main" }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  }}
                >
                  E-Commerce Store
                </Typography>
              </Box>
            </Box>

            {/* Right Section: Cart + Account */}
            <Box display="flex" alignItems="center" gap={2}>
              {/* Cart - Show for all non-admin users */}
              {!isAdmin && (
                <IconButton
                  color="inherit"
                  onClick={() => setCartDrawerOpen(true)}
                  sx={{ position: "relative" }}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              )}

              {/* User Section */}
              {user ? (
                <Box
                  onClick={handleAccountMenuOpen}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={user.photo || (user.photos && user.photos[0]?.value)}
                    alt={user.displayName}
                    sx={{ width: 35, height: 35 }}
                  />
                  {!isMobile && (
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {user.displayName?.split(" ")[0]}
                      </Typography>
                      {isAdmin && (
                        <Typography
                          variant="caption"
                          color="primary.main"
                          sx={{ display: "block", lineHeight: 1 }}
                        >
                          Admin
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate("/login")}
                  sx={{ textTransform: "none" }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Account Menu */}
      <Menu
        anchorEl={accountMenuAnchor}
        open={Boolean(accountMenuAnchor)}
        onClose={handleAccountMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      >
        {cartDrawerContent}
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
