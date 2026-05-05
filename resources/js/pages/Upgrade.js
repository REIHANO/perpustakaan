import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faDownload, faCheckCircle, faRocket, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button } from '@themesberg/react-bootstrap';
import { Table } from '@themesberg/react-bootstrap';
import { useI18n } from '../lib/i18n';

export default () => {
    const { t } = useI18n();

    return (
        <>
            <Row className="mt-lg-5 mt-4 d-flex justify-content-center">
                <Col xl={8}>
                    <h1 className="text-center fw-bolder">{t('upgrade.title', 'Upgrade to Pro')} <FontAwesomeIcon icon={faRocket} className="ms-1" /></h1>
                    <p className="text-center lead mb-lg-5 mb-4">{t('upgrade.subtitle', 'Looking to take React development to the next level? Check out the premium version of Volt React Dashboard.')}</p>
                    <Table className="comparison-table table-striped">
                        <thead className="thead-light">
                            <tr>
                                <th className="border-0"></th>
                                <th className="border-0"><h6 className="fw-bolder">{t('upgrade.demo_column', 'What is in demo?')}</h6></th>
                                <th className="border-0 fw-bolder"><h6 className="fw-bolder">{t('upgrade.pro_column', 'What is in Pro version?')}</h6></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border-0">{t('upgrade.react_components', 'React Components')}</td>
                                <td className="border-0">100</td>
                                <td className="border-0">200+</td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.dashboard_pages', 'Dashboard Pages')}</td>
                                <td className="border-0">10</td>
                                <td className="border-0">20</td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.customized_plugins', 'Customized Plugins')}</td>
                                <td className="border-0">2</td>
                                <td className="border-0">6</td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.sass_source_files', 'Sass Source Files')}</td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.documentation', 'Documentation')}</td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.advanced_sidebar', 'Advanced Sidebar')}</td>
                                <td className="border-0"><FontAwesomeIcon icon={faTimesCircle} className="ms-1 text-danger" /></td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.calendar', 'Calendar')}</td>
                                <td className="border-0"><FontAwesomeIcon icon={faTimesCircle} className="ms-1 text-danger" /></td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.mapbox', 'Mapbox')}</td>
                                <td className="border-0"><FontAwesomeIcon icon={faTimesCircle} className="ms-1 text-danger" /></td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                            </tr>
                            <tr>
                                <td className="border-0">{t('upgrade.tech_support', 'Tech Support')}</td>
                                <td className="border-0"><FontAwesomeIcon icon={faTimesCircle} className="ms-1 text-danger" /></td>
                                <td className="border-0"><FontAwesomeIcon icon={faCheckCircle} className="ms-1 text-success" /></td>
                            </tr>
                            <tr>
                                <td className="border-0"></td>
                                <td className="border-0">
                                    <Button href="https://themewagon.com/themes/volt-react/" target="_blank" variant="primary" className="m-0 mt-3 mb-3"><FontAwesomeIcon icon={faDownload} className="me-1" /> {t('actions.download', 'Download')}</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
};
