import { JSX } from 'preact';

export function Field(
  props: JSX.HTMLAttributes<HTMLInputElement> & { label?: string },
) {
  return (
    <div>
      {props.label && <label for={`field-${props.name}`}>{props.label}</label>}
      <input
        type={props.type}
        id={`field-${props.name}`}
        autocomplete='off'
        {...props}
      />
    </div>
  );
}
