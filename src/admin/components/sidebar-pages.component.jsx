import React from 'react';
import { Navigation } from '@adminjs/design-system';
import { useNavigate, useLocation } from 'react-router';
import { useCurrentAdmin } from 'adminjs';

const SidebarPages = ({ pages }) => {
    const [currentAdmin] = useCurrentAdmin();
    const location = useLocation();
    const navigate = useNavigate();

    const filteredPages = (pages || []).filter((page) => {
        if (page.name === 'Settings' && (!currentAdmin || currentAdmin.role !== 'admin')) {
            return false;
        }
        return true;
    });

    if (!filteredPages.length) return null;

    const isActive = (page) => !!location.pathname.match(`/pages/${page.name}`);

    const elements = filteredPages.map((page) => ({
        id: page.name,
        label: page.name,
        isSelected: isActive(page),
        icon: page.icon,
        href: `/admin/pages/${page.name}`,
        onClick: (event, element) => {
            event.preventDefault();
            if (element.href) {
                navigate(element.href);
            }
        },
    }));

    return <Navigation label="Pages" elements={elements} />;
};

export default SidebarPages;
