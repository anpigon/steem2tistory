import React from "react";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  InboxIcon,
  DraftsIcon,
  ListItemAvatar,
  Avatar
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

const BlogList = ({ blogs }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {blogs.map(item => {
        return (
          <React.Fragment key={item.blogId}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  alt={item.nickname}
                  src={item.profileThumbnailImageUrl}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {/* {item.nickname}
                      {item.name} */}
                      {item.description}
                    </Typography>
                    {item.url}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default BlogList;
