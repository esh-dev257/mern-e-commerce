import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Container,
  Box,
  Skeleton,
  Alert,
  Chip,
  IconButton,
  Snackbar,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
  Rating,
  Badge,
  ButtonGroup,
  Backdrop,
} from "@mui/material";
import {
  ShoppingCart,
  Add,
  Remove,
  ShoppingCartCheckout,
} from "@mui/icons-material";

const RAZORPAY_KEY_ID = "rzp_test_c0vYW5UTkY1rwD";

const ProductCard = memo(
  ({
    product,
    index,
    quantityInCart,
    isProcessing,
    isAddingToCart,
    addToCart,
    updateCartItemQuantity,
    handleBuy,
    formatPrice,
  }) => {
    const rating = Math.floor(Math.random() * 5) + 1;
    const reviewCount = Math.floor(Math.random() * 1000);

    return (
      <Grid item xs={6} sm={6} md={4} lg={3} xl={2.4}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            transition:
              "transform 0.15s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: { xs: "none", sm: "translateY(-4px)" },
              boxShadow: 2,
              "& .product-image": {
                transform: "scale(1.03)",
              },
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: { xs: 120, sm: 160, md: 180 },
              backgroundColor: "white",
            }}
          >
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              className="product-image"
              sx={{
                height: "100%",
                width: "auto",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transition: "transform 0.2s ease",
              }}
            />

            {product.originalPrice && product.originalPrice > product.price && (
              <Chip
                label={`${Math.round(
                  (1 - product.price / product.originalPrice) * 100
                )}% OFF`}
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  backgroundColor: "#cc0c39",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                }}
              />
            )}
          </Box>

          <CardContent
            sx={{
              flexGrow: 1,
              p: 1.5,
              pt: 1,
              "&:last-child": { pb: 1.5 },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                fontWeight: 400,
                lineHeight: 1.3,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                height: { xs: 36, sm: 38 },
              }}
            >
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Rating
                value={rating}
                size="small"
                readOnly
                precision={0.5}
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  color: "#FFA41C",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  ml: 0.5,
                  color: "text.secondary",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                ({reviewCount})
              </Typography>
            </Box>

            <Box sx={{ mt: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  color: "#B12704",
                  lineHeight: 1.1,
                }}
              >
                {formatPrice(product.price)}
              </Typography>

              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.3 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        mr: 0.5,
                      }}
                    >
                      {formatPrice(product.originalPrice)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#007600",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        fontWeight: 500,
                      }}
                    >
                      Save {formatPrice(product.originalPrice - product.price)}
                    </Typography>
                  </Box>
                )}
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                color: "#007600",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              Free Delivery
            </Typography>

            {quantityInCart > 0 && (
              <Chip
                size="small"
                label={`${quantityInCart} in cart`}
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontSize: "0.65rem",
                  backgroundColor: "#EAEDED",
                  border: "1px solid #D5D9D9",
                  color: "#0F1111",
                }}
              />
            )}
          </CardContent>

          <CardActions
            sx={{
              p: 1.5,
              pt: 0,
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              minHeight: 52,
            }}
          >
            {quantityInCart > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #DDD",
                  borderRadius: 1,
                  flex: 1,
                  justifyContent: "space-between",
                  px: 1,
                  py: 0.5,
                  bgcolor: "#f9f9f9",
                  height: { xs: 36, sm: 40 },
                }}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    updateCartItemQuantity(product._id, quantityInCart - 1)
                  }
                  disabled={isAddingToCart === product._id}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Box sx={{ minWidth: 24, textAlign: "center" }}>
                  {isAddingToCart === product._id ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Typography variant="body2" fontWeight={500}>
                      {quantityInCart}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    updateCartItemQuantity(product._id, quantityInCart + 1)
                  }
                  disabled={isAddingToCart === product._id}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="contained"
                size="small"
                disabled={isAddingToCart === product._id}
                onClick={() => addToCart(product)}
                sx={{
                  flex: 1,
                  textTransform: "none",
                  backgroundColor: "#FFD814",
                  color: "#111",
                  borderRadius: 1,
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  height: { xs: 36, sm: 40 },
                  minHeight: 36,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "1px solid #FCD200",
                  "&:hover": {
                    backgroundColor: "#F7CA00",
                    borderColor: "#F2C200",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    backgroundColor: "#FFF8DC",
                    borderColor: "#FFE4B5",
                    color: "#8B4513",
                    boxShadow: "none",
                    transform: "none",
                  },
                }}
              >
                {isAddingToCart === product._id ? (
                  <>
                    <CircularProgress
                      size={16}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart fontSize="small" sx={{ mr: 0.5 }} />
                    Add to Cart
                  </>
                )}
              </Button>
            )}

            <Button
              variant="contained"
              size="small"
              disabled={isProcessing === product._id}
              onClick={() => handleBuy(product)}
              sx={{
                flex: 1,
                textTransform: "none",
                backgroundColor: "#FF9900",
                color: "#111",
                borderRadius: 1,
                fontWeight: 500,
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
                height: { xs: 36, sm: 40 },
                minHeight: 36,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                border: "1px solid #FA8900",
                "&:hover": {
                  backgroundColor: "#FA8900",
                  borderColor: "#E47911",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  backgroundColor: "#FFF8DC",
                  borderColor: "#FFE4B5",
                  color: "#8B4513",
                  boxShadow: "none",
                  transform: "none",
                },
              }}
            >
              {isProcessing === product._id ? (
                <>
                  <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCartCheckout fontSize="small" sx={{ mr: 0.5 }} />
                  Buy Now
                </>
              )}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
);

const ProductSkeleton = memo(() => (
  <Grid item xs={6} sm={6} md={4} lg={3} xl={2.4}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: 1,
      }}
    >
      <Skeleton variant="rectangular" height={160} sx={{ width: "100%" }} />
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={24} width="40%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="80%" />
      </CardContent>
      <CardActions sx={{ p: 1.5, pt: 0, minHeight: 52 }}>
        <Skeleton
          variant="rectangular"
          height={30}
          sx={{ borderRadius: 0.5, width: "48%", mr: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={30}
          sx={{ borderRadius: 0.5, width: "48%" }}
        />
      </CardActions>
    </Card>
  </Grid>
));

const ProductList = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [processingPayment, setProcessingPayment] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartUpdating, setCartUpdating] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setInitialLoading(true);

        const res = await axios.get("http://localhost:5000/api/products");

        setTimeout(() => {
          setProducts(res.data);
          setError(null);
          setLoading(false);
          setInitialLoading(false);
        }, 800);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to add items to cart",
        severity: "warning",
      });
      return;
    }

    setCartUpdating(product._id);

    try {
      const savedCart = localStorage.getItem("cart");
      let currentCart = [];

      if (savedCart) {
        try {
          currentCart = JSON.parse(savedCart);
        } catch (e) {
          console.error("Error parsing cart from localStorage", e);
        }
      }

      const existingProductIndex = currentCart.findIndex(
        (item) => item._id === product._id
      );

      let updatedCart;
      if (existingProductIndex >= 0) {
        updatedCart = [...currentCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + 1,
        };

        setSnackbar({
          open: true,
          message: `Cart updated: ${product.name} (${updatedCart[existingProductIndex].quantity})`,
          severity: "success",
        });
      } else {
        updatedCart = [...currentCart, { ...product, quantity: 1 }];

        setSnackbar({
          open: true,
          message: `${product.name} added to your cart`,
          severity: "success",
        });
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbar({
        open: true,
        message: "Failed to add item to cart",
        severity: "error",
      });
    } finally {
      setTimeout(() => setCartUpdating(null), 600);
    }
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCartUpdating(productId);

    try {
      if (newQuantity < 1) {
        const updatedCart = cart.filter((item) => item._id !== productId);
        setCart(updatedCart);

        setSnackbar({
          open: true,
          message: "Item removed from cart",
          severity: "info",
        });
      } else {
        const updatedCart = cart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      setSnackbar({
        open: true,
        message: "Failed to update cart",
        severity: "error",
      });
    } finally {
      setTimeout(() => setCartUpdating(null), 600);
    }
  };

  const handleBuy = async (product) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to make a purchase",
        severity: "warning",
      });
      return;
    }

    try {
      setProcessingPayment(product._id);

      const res = await axios.post("http://localhost:5000/api/create-order", {
        amount: product.price,
        currency: "INR",
        receipt: `receipt_${product._id}`,
      });
      const order = res.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: product.name,
        description: product.description,
        image: product.image,
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/save-order", {
              productId: product._id,
              userId: user._id,
              paymentId: response.razorpay_payment_id,
              amount: product.price,
              status: "paid",
            });
            setSnackbar({
              open: true,
              message: `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
              severity: "success",
            });
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
            setProcessingPayment(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Payment failed: ${err.response?.data?.error || err.message}`,
        severity: "error",
      });
    } finally {
      setTimeout(() => setProcessingPayment(null), 600);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          flexDirection: "column",
          gap: 2,
        }}
        open={initialLoading}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
          Loading Products...
        </Typography>
      </Backdrop>

      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            mb: { xs: 1.5, sm: 2 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              fontWeight: "bold",
              color: "#131921",
            }}
          >
            Products
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {products.length > 0 && (
              <Chip
                label={`${products.length} ${
                  products.length === 1 ? "Result" : "Results"
                }`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: "medium" }}
              />
            )}
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 1,
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Grid
          container
          spacing={{ xs: 1.5, sm: 2, md: 3 }}
          justifyContent="center"
          sx={{ mx: "auto" }}
        >
          {loading
            ? Array.from(new Array(10)).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  quantityInCart={getCartItemQuantity(product._id)}
                  isProcessing={processingPayment}
                  isAddingToCart={cartUpdating}
                  addToCart={addToCart}
                  updateCartItemQuantity={updateCartItemQuantity}
                  handleBuy={handleBuy}
                  formatPrice={formatPrice}
                />
              ))}
        </Grid>

        {!loading && products.length === 0 && !error && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 1.5, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              No products available
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
            >
              Check back later for new products!
            </Typography>
          </Box>
        )}
      </Container>

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

export default ProductList;
