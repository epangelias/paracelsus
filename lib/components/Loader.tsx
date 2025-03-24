import LoaderIcon from 'https://icons.church/svg-spinners/ring-resize';

export function Loader(props: Record<string, unknown>) {
  return <LoaderIcon {...props} class={`loader-icon ${props.class}`} />;
}
