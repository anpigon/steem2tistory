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
  Avatar,
  Select
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

  // return (
  //   <List className={classes.root}>
  //     {blogs.map(item => {
  //       return (
  //         <React.Fragment key={item.blogId}>
  //           <ListItem alignItems="flex-start">
  //             <ListItemAvatar>
  //               <Avatar
  //                 alt={item.nickname}
  //                 src={item.profileThumbnailImageUrl}
  //               />
  //             </ListItemAvatar>
  //             <ListItemText primary={item.title} secondary={item.url} />
  //           </ListItem>
  //           <Divider variant="inset" component="li" />
  //         </React.Fragment>
  //       );
  //     })}
  //   </List>
  // );

  return (
    <select>
      <option>블로그를 선택하세요.</option>
      {blogs.map(item => (
        <option value={item.name} key={item.blogId}>
          {item.title}({item.url})
        </option>
      ))}
    </select>
  );
};

export default BlogList;
