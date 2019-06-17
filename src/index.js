import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// console.log(window.location.hash);
if (window.location.hash.startsWith("#access_token=")) {
  const params = window.location.hash.slice(1).split("&");
  window.localStorage.setItem("s2t_created", new Date().getTime()); // 유효시간은 3600초
  for (const param of params) {
    const [key, vaule] = param.split("=");
    window.localStorage.setItem("s2t_" + key, vaule);
  }
  // console.log(params);
  if (window.opener) {
    window.opener.location.reload();
    window.self.close();
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
