import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/all-orders", { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "cancelled":
        return "default";
      default:
        return "info";
    }
  };

  const MobileOrderCard = ({ order }) => (
    <Card
      sx={{
        mb: 2,
        boxShadow: 2,
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
          >
            {order.product?.name || "N/A"}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Order ID
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", wordBreak: "break-all" }}
            >
              {order._id}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Price
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              ₹{order.product?.price || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Customer
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {order.user?.displayName || "N/A"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {order.user?.email || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Payment ID
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", wordBreak: "break-all" }}
            >
              {order.paymentId || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Date
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(order.createdAt).toLocaleTimeString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          fontWeight: "bold",
          textAlign: { xs: "center", md: "left" },
          mb: { xs: 2, md: 3 },
        }}
      >
        Admin Dashboard
      </Typography>

      {isMobile && (
        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 2, color: "text.secondary" }}
          >
            Total Orders: {orders.length}
          </Typography>
          {orders.map((order) => (
            <MobileOrderCard key={order._id} order={order} />
          ))}
        </Box>
      )}

      {!isMobile && (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Product
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Price
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Payment ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  key={order._id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "action.hover",
                    },
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      maxWidth: isTablet ? "120px" : "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                    }}
                  >
                    {order._id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {order.user?.displayName || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: isTablet ? "120px" : "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.user?.email || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: isTablet ? "120px" : "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: "medium",
                    }}
                  >
                    {order.product?.name || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: "0.9rem",
                    }}
                  >
                    ₹{order.product?.price || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: isTablet ? "100px" : "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                    }}
                  >
                    {order.paymentId || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: "140px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {orders.length === 0 && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            mt: 4,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No orders found
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default AdminDashboard;
