import React from 'react';
import { Container, Row, Col, Card } from '@themesberg/react-bootstrap';
import { Link } from '@inertiajs/react';

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="bg-soft min-vh-100 d-flex align-items-center py-4">
            <Container>
                <Row className="justify-content-center align-items-center g-4">
                    <Col lg={6} className="d-none d-lg-block">
                        <Card className="border-0 shadow-lg p-5">
                            <Card.Body>
                                <div className="mb-4">
                                    <span className="text-primary text-uppercase fw-bold small">Perpustakaan</span>
                                    <h1 className="display-5 fw-bold mt-2">{title}</h1>
                                    <p className="text-muted mt-3">{subtitle}</p>
                                </div>
                                <div className="row g-3">
                                    <div className="col-4">
                                        <div className="p-3 rounded bg-primary-subtle text-center">
                                            <div className="fw-bold text-primary">Borrow</div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="p-3 rounded bg-success-subtle text-center">
                                            <div className="fw-bold text-success">Reserve</div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="p-3 rounded bg-warning-subtle text-center">
                                            <div className="fw-bold text-warning">Report</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Link href="/login" className="me-3 text-decoration-none">
                                        Login
                                    </Link>
                                    <Link href="/register" className="text-decoration-none">
                                        Register
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card className="border-0 shadow-lg">
                            <Card.Body className="p-4 p-md-5">
                                <div className="d-lg-none mb-4">
                                    <span className="text-primary text-uppercase fw-bold small">Perpustakaan</span>
                                    <h2 className="fw-bold mt-2">{title}</h2>
                                    <p className="text-muted">{subtitle}</p>
                                </div>
                                {children}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
