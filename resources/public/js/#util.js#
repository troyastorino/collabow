function getURL() {
  url = window.location.pathname;
  return url + ((url[url.length-1] == "/") ? "" : "/")
}

//takes a URL, and inserts a path before the ending
//ie: insertPath("/foo/baz","bar") returns "foo/bar/baz"
//note: always returns without "/" at end
function insertPath(url, path) {
  array = url.split("/")
  if (array[array.length - 1] == "")
    array.pop();
  last = array.pop();
  array.push(path);
  array.push(last);
  return array.reduce(function(prev, cur) { return prev + "/" + cur });
}
