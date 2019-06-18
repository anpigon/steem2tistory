import axios from "axios";
import qs from "querystring";

const API_URL = "https://www.tistory.com";
const client = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: { "content-type": "application/json" }
});

const getAccessToken = () => {
  return window.localStorage.getItem("s2t_access_token");
};

export const getBlogInfo = () => {
  const request = "/apis/blog/info";
  const params = {
    output: "json",
    access_token: getAccessToken()
  };
  return client
    .get(request, { params })
    .then(r => r.data.tistory.item)
    .catch(error => console.log(error));
};

export const getPostList = ({ blogName, page }) => {
  const request = "/apis/post/list";
  const params = {
    output: "json",
    access_token: getAccessToken(),
    blogName,
    page
  };
  return client.get(request, { params });
};

export const addNewPost = ({
  blogName,
  title,
  content,
  visibility = 0,
  category = 0,
  slogan,
  tag,
  acceptComment = 1
}) => {
  const request = "/apis/post/write";
  const body = {
    output: "json",
    access_token: getAccessToken(),
    blogName,
    title,
    content,
    visibility,
    category,
    slogan,
    tag,
    acceptComment
  };

  let form = new FormData();
  form.append("output", "json");
  form.append("access_token", getAccessToken());
  form.append("blogName", blogName);
  form.append("title", title);
  form.append("content", content);
  form.append("slogan", slogan);
  form.append("tag", tag);
  // console.log(qs.stringify(body));
  // return client.post(request, qs.stringify(body));
  return client.post(request, form);
};
