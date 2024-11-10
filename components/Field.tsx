import { JSX } from 'preact';

export function Field(
    props: JSX.HTMLAttributes<HTMLInputElement> & { label?: string; name: string },
) {
    return (
        <div>
            {props.label && <label for={`field-${props.name}`}>{props.label}</label>}
            <input
                type={props.type}
                id={`field-${props.name}`}
                {...props}
            />
        </div>
    );
}
