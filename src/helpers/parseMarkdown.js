import Remarkable from "remarkable";

const md = new Remarkable("full", {
  html: true,
  linkify: true,
  typographer: true
});

const parseMarkdown = body => md.render(body);

export default parseMarkdown;
