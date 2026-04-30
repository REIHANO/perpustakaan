import React, { useEffect, useMemo, useState } from 'react';
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
    const permissions = auth?.user?.permissions || [];
    const isSuperAdmin = auth?.user?.role === 'super-admin';
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;

    const [show, setShow] = useState(isDesktop);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');

        const handleChange = (event) => {
            setShow(event.matches);
        };

        handleChange(mediaQuery);
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const filteredNavigation = useMemo(() => {
        if (isSuperAdmin) {
            return navigation;
        }

        return navigation.filter((item) => {
            if (!item.permission) {
                return true;
            }

            return hasPermission(permissions, item.permission);
        });
    }, [isSuperAdmin, navigation, permissions]);

    if (!filteredNavigation.length) {
        return null;
    }

    const closeSidebar = () => {
        if (!isDesktop) {
            setShow(false);
        }
    };

    return (
        <>
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
                <SimpleBar
                    className={`sidebar d-md-block bg-primary text-white ${show ? 'show' : ''}`}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                    }}
                >
                    <div className="sidebar-inner px-4 py-4">
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
                            <Link href={brandHref} className="nav-link mb-4 ps-0 fw-bold text-white">
                                {brand}
                            </Link>

                            {filteredNavigation.map((item) => (
                                <Nav.Item key={item.href} className={url.startsWith(item.href) ? 'active' : ''}>
                                    <Link href={item.href} className="nav-link d-flex align-items-center" onClick={closeSidebar}>
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
