/* AI GENERATED COMMENT
Here is my feedback on the provided code:

The code follows a consistent coding style and is well-formatted.

It's good that the function component is exported, making it reusable in other parts of the application.

The use of destructuring and spread operators is appropriate and makes the code concise.

However, there is no validation or checking for the 'name' property in props, which is used to generate the 'for' and 'id' attributes.

It would be better to add a default value for the 'type' property, or to add validation to ensure it's not empty or null.

The autocomplete attribute is set to 'off' by default, which might not be desirable in all cases; consider making it a configurable prop.

Consider adding a key prop to the input element to improve performance when re-rendering the component.

Refactor the conditional label rendering to use a more concise syntax: {props.label && (<label ...>{props.label}</label>)}.

Consider adding a TypeScript interface for the props to improve code readability and maintainability.
*/


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
