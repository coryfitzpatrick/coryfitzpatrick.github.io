import React, { useEffect } from 'react';

export default function NotFound() {
    useEffect(() => {
        document.body.className = 'not-found-bg';

        return () => {
            document.body.classList.remove('not-found-bg');
        };
    }, []);

    return (
        <div id="not-found">
            <h3>
                <a href="https://en.wikipedia.org/wiki/Kilroy_was_here">
                    Kilroy
                </a> didn't find a page either
            </h3>
            <h2>404</h2>

            <img src="/images/killroy.svg" alt="Kilroy" />
        </div>
    );
}
