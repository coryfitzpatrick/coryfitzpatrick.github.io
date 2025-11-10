import React from 'react';
import { CONTACT_INFO } from '../constants/contact';

const Footer = React.memo(function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className="grid-d-12">
                <ul>
                    <li id="email">
                        <a href={`mailto:${CONTACT_INFO.email}`}>
                            Email: {CONTACT_INFO.email}
                        </a>
                    </li>
                    <li id="footer-name">{CONTACT_INFO.name}</li>
                    <li id="copy">Copyright © {currentYear}</li>
                </ul>
            </div>
        </footer>
    );
});

export default Footer;
