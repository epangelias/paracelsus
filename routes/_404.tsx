export function ServerCodePage(
    props = { serverCode: 404, codeDescription: 'Couldn’t find what you’re looking for.' },
) {
    return (
        <>
            <main>
                <div>
                    <h1>{props.serverCode}</h1>
                    <p>{props.codeDescription}</p>
                    <p>
                        <a href='/'>Back to the Homepage</a>
                    </p>
                </div>
            </main>
        </>
    );
}

export default function PageNotFound() {
    return ServerCodePage();
}
