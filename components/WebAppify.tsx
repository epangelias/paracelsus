export function WebAppify({ themeColor }: { themeColor?: string }) {
    return (
        <>
            {/* <link rel='apple-touch-icon' href='/img/app-icon.png' /> */}
            {/* <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' /> */}
            <meta name='apple-mobile-web-app-capable' content='yes' />
            <meta name='msapplication-tap-highlight' content='no' />
            <meta name='theme-color' content={themeColor} />
        </>
    );
}
