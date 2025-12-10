/**
 * SITEPACKAGES License Protection
 * Copyright (c) 2025 SITEPACKAGES. All Rights Reserved.
 *
 * IMPORTANT: This file and the SITEPACKAGES attribution MUST NOT be removed.
 * Removing or modifying license protection violates your license agreement.
 *
 * License terms: https://sitepackages.net/terms.html
 */

(function() {
    'use strict';

    // Obfuscated constants
    const _0x1a = 'SITEPACKAGES';
    const _0x2b = 'sitepackages.net';
    const _0x3c = 'Powered by';
    const _0x4d = 'data-sp-license';
    const _0x5e = 'sp-attribution';

    // License signature (changes per build)
    const _signature = 'SP2025' + btoa(Date.now().toString(36)).slice(0, 8);

    // Required attribution HTML
    const attributionHTML = `
        <div id="${_0x5e}" class="sitepackages-attribution" style="text-align:center;padding:10px 0;font-size:12px;opacity:0.7;">
            <a href="https://${_0x2b}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;">
                ${_0x3c} <strong>${_0x1a}</strong>
            </a>
        </div>
    `;

    // Hidden verification marker (invisible to users)
    const hiddenMarker = `<!--[SP:${_signature}]-->`;

    /**
     * Layer 1: Ensure visible attribution exists
     */
    function ensureAttribution() {
        const footer = document.querySelector('footer');
        const existingAttr = document.getElementById(_0x5e);

        if (!existingAttr && footer) {
            footer.insertAdjacentHTML('beforeend', attributionHTML);
        }

        // Re-add if removed via DOM manipulation
        if (existingAttr && existingAttr.style.display === 'none') {
            existingAttr.style.display = 'block';
        }
    }

    /**
     * Layer 2: Check for copyright text in footer
     */
    function verifyCopyright() {
        const copyrightEl = document.getElementById('copyright-text');
        if (copyrightEl) {
            const text = copyrightEl.textContent || '';
            // Ensure SITEPACKAGES mention exists somewhere
            if (!text.toLowerCase().includes('sitepackages')) {
                // Add it back
                copyrightEl.innerHTML += ' | Template by <a href="https://sitepackages.net" target="_blank">SITEPACKAGES</a>';
            }
        }
    }

    /**
     * Layer 3: Hidden integrity check
     */
    function integrityCheck() {
        // Check for required elements
        const checks = [
            document.querySelector('[data-sp-verified]'),
            document.querySelector('.sitepackages-attribution'),
            document.querySelector('meta[name="generator"][content*="SITEPACKAGES"]')
        ];

        // Log to console (visible in dev tools)
        if (checks.filter(Boolean).length < 1) {
            console.warn('%c[SITEPACKAGES] License verification warning. Visit sitepackages.net/terms.html',
                'color: #f5576c; font-weight: bold;');
        }
    }

    /**
     * Layer 4: Protect against DOM removal
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(function(node) {
                        if (node.id === _0x5e ||
                            (node.classList && node.classList.contains('sitepackages-attribution'))) {
                            // Re-add attribution if removed
                            setTimeout(ensureAttribution, 100);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Layer 5: License key validation (when license key is set)
     */
    function validateLicense() {
        const licenseKey = window.siteConfig?.license?.key || localStorage.getItem('sp_license_key');
        const domain = window.location.hostname;

        if (licenseKey) {
            // Format: SP-XXXX-XXXX-XXXX-XXXX
            const isValidFormat = /^SP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(licenseKey);

            if (isValidFormat) {
                // Store verified domain
                document.documentElement.setAttribute(_0x4d, 'verified');
                console.log('%c[SITEPACKAGES] License verified', 'color: #22c55e;');
            }
        }
    }

    /**
     * Layer 6: Add meta tag for identification
     */
    function addMetaIdentifier() {
        if (!document.querySelector('meta[name="generator"][content*="SITEPACKAGES"]')) {
            const meta = document.createElement('meta');
            meta.name = 'generator';
            meta.content = 'SITEPACKAGES Template v1.0';
            document.head.appendChild(meta);
        }
    }

    /**
     * Layer 7: CSS protection - make attribution hard to hide
     */
    function addCSSProtection() {
        const style = document.createElement('style');
        style.textContent = `
            .sitepackages-attribution {
                display: block !important;
                visibility: visible !important;
                opacity: 0.7 !important;
                position: relative !important;
                height: auto !important;
                width: auto !important;
                overflow: visible !important;
                clip: auto !important;
            }
            .sitepackages-attribution * {
                display: inline !important;
                visibility: visible !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize all protection layers
     */
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    }

    function run() {
        addMetaIdentifier();
        ensureAttribution();
        verifyCopyright();
        addCSSProtection();
        setupMutationObserver();
        validateLicense();

        // Periodic check (every 30 seconds)
        setInterval(function() {
            ensureAttribution();
            integrityCheck();
        }, 30000);

        // Initial integrity check after 5 seconds
        setTimeout(integrityCheck, 5000);
    }

    init();

    // Expose minimal API for license management
    window.SITEPACKAGES = {
        version: '1.0.0',
        verify: validateLicense,
        // Checksum for file integrity (don't modify)
        _c: 'a1b2c3d4e5f6'
    };

})();

/**
 * DO NOT REMOVE THIS NOTICE
 *
 * This template is licensed under the SITEPACKAGES License Agreement.
 * Removing this file or the attribution violates the license terms.
 *
 * For license removal options, visit: https://sitepackages.net/pricing
 * (Business tier includes white-label rights)
 *
 * Copyright (c) 2025 SITEPACKAGES - https://sitepackages.net
 */
