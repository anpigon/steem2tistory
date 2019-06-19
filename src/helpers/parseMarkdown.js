import _ from "lodash";
import Remarkable from "remarkable";
import embedjs from "embedjs";
import sanitizeHtml from "sanitize-html";
import { imageRegex, dtubeImageRegex, rewriteRegex } from "./regexHelpers";
import improve from "./improve";
import sanitizeConfig from "./SanitizeConfig";
import htmlReady from "./steemitHtmlReady";

const remarkable = new Remarkable({
  html: true, // Remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: "“”‘’"
});

const getEmbed = link => {
  const embed = embedjs.get(link, {
    width: "100%",
    height: 400,
    autoplay: false
  });

  if (_.isUndefined(embed)) {
    return {
      provider_name: "",
      thumbnail: "",
      embed: link
    };
  }

  return embed;
};

// Should return text(html) if returnType is text
// Should return Object(React Compatible) if returnType is Object

export function getHtml(
  body = "",
  jsonMetadata = "{}",
  returnType = "Object",
  options = {}
) {
  const parsedJsonMetadata = JSON.parse(jsonMetadata) || {};
  parsedJsonMetadata.image = parsedJsonMetadata.image || [];

  let parsedBody = body.replace(
    /<!--([\s\S]+?)(-->|$)/g,
    "(html comment removed: $1)"
  );

  parsedBody.replace(imageRegex, img => {
    if (
      _.filter(parsedJsonMetadata.image, i => i.indexOf(img) !== -1).length ===
      0
    ) {
      parsedJsonMetadata.image.push(img);
      parsedBody = parsedBody.replace(
        new RegExp(`^(${img})$`, "gm"),
        `<img src='${img}' />`
      );
    }
  });

  parsedBody = improve(parsedBody);
  parsedBody = remarkable.render(parsedBody);

  const htmlReadyOptions = {
    mutate: true,
    resolveIframe: returnType === "text"
  };
  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  parsedBody = parsedBody.replace(dtubeImageRegex, "");

  if (options.rewriteLinks) {
    parsedBody = parsedBody.replace(
      rewriteRegex,
      (match, p1) => `"${p1 || "/"}"`
    );
  }

  parsedBody = sanitizeHtml(
    parsedBody,
    sanitizeConfig({
      appUrl: options.appUrl,
      secureLinks: options.secureLinks
    })
  );
  if (returnType === "text") {
    return parsedBody;
  }

  const sections = [];

  const splittedBody = parsedBody.split("~~~ embed:");
  for (let i = 0; i < splittedBody.length; i += 1) {
    let section = splittedBody[i];

    const match = section.match(/^([A-Za-z0-9_-]+) ([A-Za-z]+) (\S+) ~~~/);
    if (match && match.length >= 4) {
      const id = match[1];
      const type = match[2];
      const link = match[3];
      const embed = getEmbed(link);
      // sections.push(
      //   ReactDOMServer.renderToString(
      //     <PostFeedEmbed key={`embed-a-${i}`} inPost embed={embed} />
      //   )
      // );
      section = section.substring(`${id} ${type} ${link} ~~~`.length);
    }
    if (section !== "") {
      sections.push(section);
    }
  }
  // eslint-disable-next-line react/no-danger
  // return <div dangerouslySetInnerHTML={{ __html: sections.join("") }} />;
  return sections.join("");
}

// const parseMarkdown = body => remarkable.render(body);
const options = {
  appUrl: "https://steemit.com",
  rewriteLinks: true,
  secureLinks: true
};
// const jsonMetadata = "{}";
const parseMarkdown = ({ body, jsonMetadata }) =>
  getHtml(body, jsonMetadata, "Object", options);

export default parseMarkdown;
