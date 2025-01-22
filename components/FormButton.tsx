import { JSX } from 'preact';
import { Loader } from '@/components/Loader.tsx';

export function FormButton(props: JSX.ButtonHTMLAttributes) {
  return (
    <button {...props}>
      {props.children} <Loader />
    </button>
  );
}
