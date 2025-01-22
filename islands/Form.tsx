// ./repos/paracelsus/islands/Form.tsx
import { JSX } from 'preact';
import { useSignal } from '@preact/signals';
import { delay } from '@std/async/delay';
import { Alert } from '@/islands/Alert.tsx';

export function Form(props: JSX.HTMLAttributes<HTMLFormElement> & { method?: string }) {
  const isLoading = useSignal(false);
  const alertMessage = useSignal<{ message: string; type: 'error' | 'success'; id: number } | null>(null);

  const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (isLoading.value) return;

    const form = e.currentTarget;
    isLoading.value = true;

    const buttons = form.querySelectorAll('button');
    buttons.forEach((button) => (button.disabled = true));

    try {
      await delay(1000); // For testing

      const formData = new FormData(form);
      const method = (form.method || 'get').toLowerCase();
      let url = form.action || globalThis.location.href;

      let res;
      if (method === 'get') {
        const params = new URLSearchParams(formData);
        url = `${url}${url.includes('?') ? '&' : '?'}${params}`;
        res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          },
        });
      } else {
        res = await fetch(url, {
          method,
          body: formData,
          headers: {
            'Accept': 'text/plain',
          },
        });
      }

      if (!res.ok) {
        alertMessage.value = { message: `${await res.text()}`, type: 'error', id: Math.random() };
        return;
      }

      if (res.redirected) {
        globalThis.location.href = res.url;
      } else if (method === 'get') {
        globalThis.location.href = url;
      }

      const text = await res.text();

      if (text) {
        alertMessage.value = { message: text, type: 'success', id: Math.random() };
      }
    } catch (err) {
      alertMessage.value = {
        message: err instanceof Error ? err.message : 'An error occurred',
        type: 'error',
        id: Math.random(),
      };
    } finally {
      isLoading.value = false;
      buttons.forEach((button) => (button.disabled = false));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} data-loading={isLoading.value} {...props}>
        {props.children}
      </form>
      {alertMessage.value && (
        <Alert message={alertMessage.value.message} type={alertMessage.value.type} id={alertMessage.value.id} />
      )}
    </>
  );
}
