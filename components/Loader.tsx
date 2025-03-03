import LoaderIcon from 'https://icons.church/svg-spinners/ring-resize';

export function Loader(props: unknown) {
  return <LoaderIcon {...props as object} class={`loader-icon ${(props as { class: string }).class}`} />;
}
