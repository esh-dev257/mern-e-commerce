import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Avatar,
  Fade,
  Switch,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import {
  ShoppingBag,
  Google,
  ArrowForward,
  AdminPanelSettings,
  Person,
} from "@mui/icons-material";

const LoginPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const theme = useTheme();

  const handleLoginToggle = () => {
    setIsAdmin(!isAdmin);
  };

  const handleLogin = () => {
    // Redirect to the appropriate login URL based on the mode
    const loginUrl = isAdmin
      ? "http://localhost:5000/auth/google/"
      : "http://localhost:5000/auth/google";

    window.open(loginUrl, "_self");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)",
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={500}>
        <Container maxWidth="xs">
          {/* Brand */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mb: 2,
                background: isAdmin
                  ? "linear-gradient(90deg, #1a237e 0%, #283593 100%)"
                  : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.25)",
                transition: "background 0.3s ease",
              }}
            >
              {isAdmin ? (
                <AdminPanelSettings sx={{ fontSize: 30, color: "white" }} />
              ) : (
                <ShoppingBag sx={{ fontSize: 30, color: "white" }} />
              )}
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#333",
                mb: 0.5,
                fontSize: { xs: "1.75rem", sm: "2rem" },
              }}
            >
              E-Commerce Store
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "0.95rem" }}
            >
              Sign in to continue
            </Typography>
          </Box>

          {/* Login Card */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              overflow: "visible",
              backgroundColor: "white",
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAdmin}
                      onChange={handleLoginToggle}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: isAdmin ? "#1a237e" : "#667eea",
                          "&:hover": {
                            backgroundColor: "rgba(26, 35, 126, 0.08)",
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: isAdmin ? "#1a237e" : "#667eea",
                          },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {isAdmin ? (
                        <>
                          <AdminPanelSettings
                            fontSize="small"
                            sx={{ color: "#1a237e" }}
                          />
                          Admin Mode
                        </>
                      ) : (
                        <>
                          <Person fontSize="small" sx={{ color: "#667eea" }} />
                          Customer Mode
                        </>
                      )}
                    </Typography>
                  }
                />
              </Box>

              <Typography
                variant="h5"
                component="h2"
                align="center"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "#333",
                }}
              >
                Welcome back
              </Typography>

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{
                  mb: 3.5,
                }}
              >
                {isAdmin
                  ? "Sign in to manage products, orders and users"
                  : "Sign in to shop and manage your orders"}
              </Typography>

              {/* Login Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                startIcon={<Google />}
                endIcon={
                  <ArrowForward
                    sx={{
                      transition: "transform 0.2s ease-in-out",
                      transform: isHovered ? "translateX(4px)" : "none",
                    }}
                  />
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: isAdmin
                    ? "linear-gradient(90deg, #1a237e 0%, #283593 100%)"
                    : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  transition: "all 0.3s",
                  boxShadow: isAdmin
                    ? "0 4px 15px rgba(26, 35, 126, 0.2)"
                    : "0 4px 15px rgba(102, 126, 234, 0.2)",
                  "&:hover": {
                    background: isAdmin
                      ? "linear-gradient(90deg, #151d69 0%, #232e7f 100%)"
                      : "linear-gradient(90deg, #5a6fd5 0%, #6a3f97 100%)",
                    boxShadow: isAdmin
                      ? "0 6px 20px rgba(26, 35, 126, 0.3)"
                      : "0 6px 20px rgba(102, 126, 234, 0.3)",
                  },
                }}
              >
                {`Sign in as ${isAdmin ? "Admin" : "Customer"}`}
              </Button>

              {/* Terms */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  By signing in, you agree to our{" "}
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ color: isAdmin ? "#1a237e" : "#667eea" }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ color: isAdmin ? "#1a237e" : "#667eea" }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Fade>
    </Box>
  );
};

export default LoginPage;
