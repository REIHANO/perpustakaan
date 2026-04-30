import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Link, usePage } from '@inertiajs/react';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Nav, Badge, Navbar, Button } from '@themesberg/react-bootstrap';
import { hasPermission } from '../lib/permissions';

export default function Sidebar({ brand = 'Volt Library', brandHref = '/', navigation = [] }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [show, setShow] = useState(false);
    const showClass = show ? 'show' : '';
    const permissions = auth?.user?.permissions || [];
    const filteredNavigation = navigation.filter((item) => {
        if (!item.permission) {
            return true;
        }

        return hasPermission(permissions, item.permission);
    });

    if (!filteredNavigation.length) {
        return null;
    }

    return (
        <>
            {/* Mobile Navbar */}
            <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
                <Link href={brandHref} className="navbar-brand me-lg-5">
                    <span className="fw-bold text-white">{brand}</span>
                </Link>
                <Navbar.Toggle
                    as={Button}
                    aria-controls="main-navbar"
                    onClick={() => setShow((value) => !value)}
                    className="border-0"
                >
                    <span className="navbar-toggler-icon" />
                </Navbar.Toggle>
            </Navbar>

            <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
                <SimpleBar className={`${showClass} sidebar d-md-block bg-primary text-white`}>
                    <div className="sidebar-inner px-4 pt-3">
                        
                        {/* User Card - Mobile Only */}
                        <div className="d-flex align-items-center justify-content-between pb-4 d-md-none">
                            <div>
                                <div className="fw-bold text-uppercase text-primary small">Perpustakaan</div>
                                <h5 className="mb-0">{auth?.user?.name || 'Guest'}</h5>
                            </div>
                            <div className="collapse-close" style={{ cursor: 'pointer' }} onClick={() => setShow(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
                        </div>

                        <Nav className="flex-column pt-3 pt-md-0">
                            {/* Brand Logo / Name */}
                            <Link href={brandHref} className="nav-link mb-3 ps-0 fw-bold text-primary">
                                {brand}
                            </Link>

                            {/* Navigation Items */}
                            {Array.isArray(filteredNavigation) && filteredNavigation.map((item) => (
                                <Nav.Item key={item.href} className={url.startsWith(item.href) ? 'active' : ''}>
                                    {/* Perbaikan: Menggunakan Link langsung dengan class nav-link */}
                                    <Link href={item.href} className="nav-link d-flex align-items-center" onClick={() => setShow(false)}>
                                        {item.icon ? <i className={`bi ${item.icon} me-3 fs-5`} /> : null}
                                        <span className="sidebar-text">{item.label}</span>
                                        {item.badge ? (
                                            <Badge pill bg="primary" className="ms-auto">
                                                {item.badge}
                                            </Badge>
                                        ) : null}
                                    </Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </div>
                </SimpleBar>
            </CSSTransition>
        </>
    );
}
