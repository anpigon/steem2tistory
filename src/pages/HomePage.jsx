import React, { useCallback } from "react";
import clsx from "clsx";
import styled from "styled-components";

import * as Tistory from "../services/TistoryService";
import * as Steemit from "../services/SteemitService";

import { makeStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  Container,
  Toolbar,
  AppBar,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  ListItemAvatar,
  Avatar,
  InputBase,
  IconButton,
  LinearProgress
} from "@material-ui/core";

import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";

import BlogList from "../components/BlogList";
import DiscussionList from "../components/DiscussionList";

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

const useInput = defaultValue => {
  const [value, setValue] = React.useState(defaultValue);
  const onChange = e => {
    setValue(e.target.value);
  };
  return [value, onChange];
};

const HomePage = () => {
  const classes = useStyles();

  const [busy, setBusy] = React.useState(false);
  const [isLogined, setIsLogined] = React.useState(false);
  const [username, setUsername] = useInput("anpigon");
  const [blogs, setBlogs] = React.useState([]);
  const [userId, setUserId] = React.useState();
  const [discussions, setDiscussions] = React.useState([]);

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

  const loadTistoryInfos = async () => {
    const { blogs, id, userId } = await Tistory.getBlogInfo();
    console.log({ blogs, setUserId, userId });
    setBlogs(blogs);
    setUserId(id);
  };

  React.useEffect(() => {
    const s2tCreated = parseInt(window.localStorage.getItem("s2t_created"), 10);
    const s2tAccessToken = window.localStorage.getItem("s2t_access_token");

    // 토큰 유효함
    if (s2tCreated + 3600000 > new Date().getTime()) {
      console.log("logined");
      setIsLogined(true);

      loadTistoryInfos();
    } else {
      // 토큰 유효 시간 만료
      window.localStorage.removeItem("s2t_created");
      window.localStorage.removeItem("s2t_access_token");
      setIsLogined(false);
    }
  }, []);

  const getSteemitBlogs = async () => {
    // const blogs = await Steemit.getBlogs(username);
    setBusy(true);
    const discussions = await Steemit.getDiscussionsByAuthorBeforeDate(
      username
    );
    setDiscussions(discussions);
    console.log(discussions);
    setBusy(false);
  };

  const addNewPost = async item => {
    console.log("addNewPost", item);
    const { title, body, author, permlink, json_metadata, url } = item;
    const htmlBody = await Steemit.getHtmlBody(url);
    console.log(htmlBody);

    // const tag = JSON.parse(json_metadata).tags.join(",");
    // const newPost = {
    //   blogName: "anpigon",
    //   title,
    //   content: body,
    //   slogan: `${author}_${permlink}`,
    //   tag
    // };
    // const result = await Tistory.addNewPost(newPost);
    // console.log(result);
  };

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
            <>
              {userId}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
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
              <Paper className={classes.paper}>
                <BlogList blogs={blogs} />
              </Paper>
            </Grid>
            <Grid item xs={12} spacing={1}>
              <Grid item xs={6} />
              <Grid item xs={6}>
                <>
                  <IconButton
                    className={classes.iconButton}
                    aria-label="Account"
                  >
                    <AccountCircle />
                  </IconButton>
                  <InputBase
                    value={username}
                    onChange={setUsername}
                    className={classes.input}
                    placeholder="username"
                    inputProps={{ "aria-label": "username" }}
                  />
                  <IconButton
                    className={classes.iconButton}
                    aria-label="Search"
                    onClick={getSteemitBlogs}
                  >
                    <SearchIcon />
                  </IconButton>
                </>
                {busy && <LinearProgress />}
                <Paper className={classes.paper}>
                  <DiscussionList
                    discussions={discussions}
                    addNewPost={addNewPost}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default HomePage;
