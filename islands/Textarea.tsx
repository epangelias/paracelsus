import { useEffect, useRef } from 'preact/hooks';
import { JSX, RefObject } from 'preact';

export function TextArea(
  props: JSX.HTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    inputRef?: RefObject<HTMLTextAreaElement>;
  },
) {
  const textareaRef = props.inputRef || useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function OnInput() {
    if (!textareaRef.current) return;
    if (containerRef?.current) {
      containerRef.current.style.height = textareaRef.current.clientHeight + 'px';
    }
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = (textareaRef.current.scrollHeight) + 'px';
    if (containerRef?.current) containerRef.current.style.height = 'auto';
  }

  useEffect(() => {
    if (!textareaRef.current) return;
    const value = 'height:' + (textareaRef.current.scrollHeight) + 'px;overflow-y:auto';
    textareaRef.current.setAttribute('style', value);
    textareaRef.current.addEventListener('input', OnInput);
    setInterval(() => OnInput(), 100);
  }, []);

  return (
    <div ref={containerRef} class='textarea-container'>
      {props.label && <label for={`field-${props.name}`}>{props.label}</label>}
      <textarea
        rows={1}
        autocomplete='off'
        ref={textareaRef}
        {...props}
      >
      </textarea>
    </div>
  );
}
