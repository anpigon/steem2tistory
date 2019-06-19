import _ from "lodash";
import React, { useCallback } from "react";
import clsx from "clsx";
import styled from "styled-components";
import "../App.css";

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

import parseMarkdown from "../helpers/parseMarkdown";

import PostModal from "../components/PostModal";

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
  const [username, setUsername] = useInput("wangpigon");
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

  const [blogName, setBlogName] = React.useState("anpigon");
  const [blogPostList, setBlogPostList] = React.useState([]);

  const loadTistoryInfos = async () => {
    console.log("loadTistoryInfos");
    const { blogs, id, userId } = await Tistory.getBlogInfo();
    console.log({ blogs, setUserId, userId });
    setBlogs(blogs);
    setUserId(id);

    console.log("blogName:", blogName);
    if (blogName) {
      const allResult = [];
      for (let page = 1; ; page++) {
        const results = await Tistory.getPostList({ blogName, page });
        for (const post of results.posts) {
          allResult.push(post);
        }
        // console.log("results.count", results.count);
        if (allResult.length >= results.totalCount) break;
      }
      console.log("allResult", allResult);
      setBlogPostList(allResult);
    }
  };

  // componentDidMounted
  React.useEffect(() => {
    // 티스토리 액세스 토큰 정보 가져오기
    const s2tCreated = parseInt(window.localStorage.getItem("s2t_created"), 10);
    const s2tAccessToken = window.localStorage.getItem("s2t_access_token");

    // 액세스 토큰이 유효함
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스팀잇 글 가져오기
  const getSteemitBlogs = async () => {
    // const blogs = await Steemit.getBlogs(username);
    setBusy(true);
    const discussions = await Steemit.getDiscussionsByAuthorBeforeDate(username)
      .then(items => {
        return items.map(item =>
          _.pick(item, [
            "post_id",
            "author",
            "body",
            "category",
            "created",
            "title",
            "json_metadata",
            "permlink",
            "url"
          ])
        );
      })
      .then(items => {
        return items.map(item => {
          const [finded] = blogPostList.filter(b => {
            const tistoryTitle = b.title.trim().replace(/\s/g, "");
            const steemitTitle = item.title.trim().replace(/\s/g, "");
            if (
              steemitTitle === tistoryTitle ||
              steemitTitle.indexOf(tistoryTitle) !== -1
            )
              return true;
            return false;
          });
          // const finded = _.find(blogPostList, { title: item.title.trim() });
          console.log(`[${item.title}] finded:`, finded);
          if (finded && finded.id) {
            return {
              ...item,
              tistory: {
                ...finded,
                blogName
              }
            };
          }
          console.log("item:", item);
          return item;
        });
      });
    console.log(discussions);

    setDiscussions(discussions);
    setBusy(false);
  };

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState({});
  const handleClose = value => {
    console.log("handleClose", value);
    setOpen(false);
  };
  const handleClickOpen = value => {
    console.log("handleClickOpen", value);
    setSelectedValue(value);
    setOpen(true);
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
                    onClickOpen={handleClickOpen}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
      <PostModal
        open={open}
        onClose={handleClose}
        selectedValue={selectedValue}
      />
    </div>
  );
};

export default HomePage;
