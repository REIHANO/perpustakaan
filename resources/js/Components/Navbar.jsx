import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Navbar, Container, Nav, Form, InputGroup, Dropdown, Image, Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faSignOutAlt, faUserCircle, faCog } from '@fortawesome/free-solid-svg-icons';

export default function TopNavbar({ title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const form = useForm({ query: '' });
    const permissions = auth?.user?.permissions || [];
    const isSuperAdmin = auth?.user?.role === 'super-admin';
    const isAdminLike =
        permissions.includes('*') ||
        permissions.includes('manage-books') ||
        permissions.includes('manage-categories') ||
        permissions.includes('manage-circulation') ||
        permissions.includes('set-fine') ||
        permissions.includes('view-reports');
    const profileHref = isSuperAdmin ? '/super-admin/users' : isAdminLike ? '/admin/dashboard' : '/member/profile';

    return (
        <Navbar variant="light" expanded className="ps-0 pe-2 pb-0 mb-4">
            <Container fluid className="px-0">
                <div className="d-flex justify-content-between w-100 align-items-center flex-wrap gap-3">
                    <div>
                        <h4 className="mb-0 text-dark">{title}</h4>
                        <small className="text-muted">Sistem Informasi Perpustakaan</small>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <Form className="navbar-search d-none d-md-block">
                            <InputGroup className="input-group-merge search-bar">
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    value={form.data.query}
                                    onChange={(e) => form.setData('query', e.target.value)}
                                />
                            </InputGroup>
                        </Form>

                        <Dropdown as={Nav.Item}>
                            <Dropdown.Toggle as={Nav.Link} className="icon-notifications me-lg-3">
                                <span className="icon icon-sm">
                                    <FontAwesomeIcon icon={faBell} className="bell-shake" />
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                                <div className="px-3 py-2 border-bottom">
                                    <strong>Notifications</strong>
                                </div>
                                <div className="px-3 py-4 text-muted small">Tidak ada notifikasi baru.</div>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown as={Nav.Item}>
                            <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                                <div className="media d-flex align-items-center">
                                    <div className="user-avatar md-avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                        {auth?.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                                        <span className="mb-0 font-small fw-bold">{auth?.user?.name || 'User'}</span>
                                    </div>
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                                <Dropdown.Item as={Link} href={profileHref} className="fw-bold">
                                    <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                                    {isSuperAdmin ? 'Manage Users' : 'Profile'}
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} href={isSuperAdmin ? '/super-admin/permissions' : profileHref} className="fw-bold">
                                    <FontAwesomeIcon icon={faCog} className="me-2" />
                                    {isSuperAdmin ? 'Permissions' : 'Settings'}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} href="/logout" method="post" className="fw-bold text-danger">
                                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
}
