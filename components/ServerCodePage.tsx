export function ServerCodePage(
    props = { code: 404, message: 'Couldn’t find what you’re looking for.' },
) {
    return (
        <>
            <main>
                <div>
                    <h1>{props.code}</h1>
                    <p>{props.message}</p>
                    <p>
                        <a href='/'>Back to the Homepage</a>
                    </p>
                </div>
            </main>
        </>
    );
}
