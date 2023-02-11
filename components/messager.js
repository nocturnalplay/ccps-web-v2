import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const LoadingSkeleton = (props) => {
  return (
    <Stack spacing={1}>
      <Skeleton {...props} />
    </Stack>
  );
};

export const Loading = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100px",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export const AlertMessage = (props) => {
  return (
    <Alert
      variant="filled"
      severity={props.title}
      className="global-alert"
    >
      <AlertTitle style={{ textTransform: "capitalize" }}>
        {props.title}
      </AlertTitle>
      {props.msg}
    </Alert>
  );
};
