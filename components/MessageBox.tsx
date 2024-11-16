export function MessageBox(
  { message, error, inline }: { message?: string; error?: string; inline?: boolean },
) {
  if (error) {
    return inline
      ? <span class='error-message'>{error}</span>
      : <p class='error-message'>{error}</p>;
  } else if (message) {
    return inline ? <span class='message'>{message}</span> : <p class='message'>{message}</p>;
  } else return <></>;
}
