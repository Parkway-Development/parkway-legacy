const EmailDisplay = ({ email }: { email: string | undefined }) => {
  if (!email) return undefined;
  return <a href={`mailto:${email}`}>{email}</a>;
};

export default EmailDisplay;
