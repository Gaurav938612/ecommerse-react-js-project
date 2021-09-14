const url = "http://localhost:8080";

export const getImageSrc = (byteArray) => {
  var img = null;
  if (byteArray != null) img = new Buffer.from(byteArray).toString("base64");
  const file = "data:image/png;base64," + img;
  return file;
};

export const SendRequest = async (props) => {
  const { path, method, body, formData, token, extra } = props;

  const Response = await fetch(`${url}/${path}`, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      Authorization: token !== undefined ? "Bearer " + token : null,
      Extra: extra,
      "Content-Type": "application/json",
    },
  });
  if (!Response.ok) {
    const msg = "Here We have error  : " + Response.status;
    console.log("response :", Response);
    throw new Error(msg);
  }
  const data = await Response.json();
  return data;
};
export const SendRequestFormData = async (props) => {
  const { path, method, body, formData, token, extra } = props;
  console.log("formDta" + formData);

  const Response = await fetch(`${url}/${path}`, {
    method: method,
    body: formData,
    headers: {
      Authorization: token !== undefined ? "Bearer " + token : null,
      Extra: extra,
    },
  });
  if (!Response.ok) {
    const msg = "Here We have error  : " + Response.status;
    console.log("response :", Response);
    throw new Error(msg);
  }
  const data = await Response.json();
  return data;
};

export function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + 30 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
export function deleteAllCookies() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}
