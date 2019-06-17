import React, { useCallback } from "react";
import clsx from "clsx";
import styled from "styled-components";

import { makeStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  Container,
  Toolbar,
  AppBar,
  Typography,
  Grid,
  Paper,
  Button
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  title: {
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
}));

// const Container = styled.div`
//   flex: 1;
// `;

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const HomePage = () => {
  const classes = useStyles();

  const [isLogined, setIsLogined] = React.useState(false);

  // 로그인
  const login = React.useCallback(() => {
    const url = `https://www.tistory.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token`;
    // console.log(url);
    window.open(url, "login_popup", "width=500,height=500");
  });
  const logout = React.useCallback(() => {
    window.localStorage.removeItem("s2t_created");
    window.localStorage.removeItem("s2t_access_token");
    window.location.reload();
  });

  React.useEffect(() => {
    const s2tCreated = parseInt(window.localStorage.getItem("s2t_created"), 10);
    const s2tAccessToken = window.localStorage.getItem("s2t_access_token");

    // 토큰 유효함
    if (s2tCreated + 3600000 > new Date().getTime()) {
      console.log("logined");
      setIsLogined(true);
    } else {
      // 토큰 유효 시간 만료
      window.localStorage.removeItem("s2t_created");
      window.localStorage.removeItem("s2t_access_token");
      setIsLogined(false);
    }
  }, []);

  console.log("isLogined:", isLogined);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Steem2Tistory
          </Typography>
          {isLogined ? (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper className={classes.paper} />
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default HomePage;
