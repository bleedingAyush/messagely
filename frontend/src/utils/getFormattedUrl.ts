export function getFormattedUrl(profileUrl: string | undefined) {
  if (profileUrl) {
    let domain = new URL(profileUrl);

    let hostName = domain.hostname;
    if (hostName === "ik.imagekit.io") {
      let pathNameSplit = domain.pathname.split("/");
      pathNameSplit.splice(2, 0, "tr:h-300,w-300");
      profileUrl = domain.origin + pathNameSplit.join("/");
    }
  }
  return profileUrl;
}
