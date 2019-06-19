import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogTitle,
  Modal,
  Typography,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

import parseMarkdown from "../helpers/parseMarkdown";
import * as Tistory from "../services/TistoryService";

const useStyles = makeStyles({
  body: {
    height: 500,
    overflowY: "scroll"
  }
});

export default props => {
  const classes = useStyles();
  const { onClose, selectedValue, ...other } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  const publishPost = async html => {
    console.log("publishPost", selectedValue);
    const {
      title,
      body,
      author,
      permlink,
      json_metadata,
      url,
      tistory
    } = selectedValue;
    // const htmlBody = await Steemit.getHtmlBody(url);
    // console.log(htmlBody);

    const tag = JSON.parse(json_metadata).tags.join(",");
    let categoryId, visibility, postId;
    if (tistory)
      ({
        // blogName,
        categoryId,
        // comments
        // date
        id: postId,
        // postUrl
        // title
        // trackbacks
        visibility
      } = tistory);
    const newPost = {
      blogName: "anpigon",
      title,
      content: html,
      slogan: `${author}_${permlink}`,
      tag,
      postId,
      categoryId,
      visibility
    };
    console.log("newPost:", newPost);
    const result = await Tistory.publishPost(newPost);

    console.log(result);
    onClose();
  };

  const { body, json_metadata: jsonMetadata } = selectedValue;
  const html = parseMarkdown({ body, jsonMetadata });
  // console.log("html:", html);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      {...other}
    >
      <DialogTitle id="simple-dialog-title">{selectedValue.title}</DialogTitle>
      <DialogContent
        id="post-body-html"
        dangerouslySetInnerHTML={{ __html: html }}
        className={classes.body}
      >
        {/* <div
          id="post-body-html"
          dangerouslySetInnerHTML={{ __html: html }}
          className={classes.body}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => publishPost(html)}
        >
          발행
        </Button>
      </DialogActions>
    </Dialog>
  );
};
