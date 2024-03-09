const WebsiteDisplay = ({ website }: { website: string | undefined }) => {
  if (!website) return undefined;

  let link: string | undefined = undefined;

  if (website.toLowerCase().startsWith('http')) link = website;
  else if (website.trim().indexOf(' ') === -1) link = 'https://' + website;

  return link ? (
    <a href={link} rel="noopener" target="_blank">
      {link}
    </a>
  ) : (
    <span>{website}</span>
  );
};

export default WebsiteDisplay;
