import axios from "axios";
import request from "request";

const API_URL = "https://api.steemit.com";

export const getHtmlBody = url => {
  // return axios.get(`https://steemit.com${url}`);
  // return axios.get(`https://busy.org${url}`);
  // return axios.get(`https://partiko.app${url}`);
  request.get(`https://steemit.com${url}`, r => console.log(r));
};

export const getBlogs = (username, startEntryId = 0, limit = 100) => {
  const data = {
    jsonrpc: "2.0",
    method: "condenser_api.get_blog",
    params: [username, startEntryId, limit],
    id: 1
  };
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify(data),
    url: API_URL
  };
  return axios(options)
    .then(r => r.data.result)
    .catch(error => console.log(error));
};

export const getDiscussionsByAuthorBeforeDate = (
  username,
  startpermlink = "",
  limit = 100
) => {
  const data = {
    jsonrpc: "2.0",
    method: "condenser_api.get_discussions_by_author_before_date",
    params: [username, startpermlink, "1970-01-01T00:00:00", limit],
    id: 1
  };
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify(data),
    url: API_URL
  };
  return axios(options)
    .then(r => r.data.result)
    .catch(error => console.log(error));
};
// https://developers.steem.io/apidefinitions/#condenser_api.get_discussions_by_author_before_date
