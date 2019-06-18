import axios from "axios";

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
