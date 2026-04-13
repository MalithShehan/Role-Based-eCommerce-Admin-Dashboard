import React, { useState } from 'react';
import { ApiClient } from 'adminjs';
import { Box, Button, Text, Icon, DrawerContent, DrawerFooter, MessageBox } from '@adminjs/design-system';

const api = new ApiClient();

const CustomDeleteAction = (props) => {
    const { record, resource, action } = props;
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await api.recordAction({
                resourceId: resource.id,
                recordId: record.id,
                actionName: action.name,
                method: 'post',
            });
            // Hard redirect forces full page reload with fresh resequenced data
            window.location.href = `/admin/resources/${resource.id}`;
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <>
            <DrawerContent>
                <MessageBox
                    mb="xxl"
                    variant="danger"
                    message={`Do you really want to remove this item (#${record.params?.id || record.id})?`}
                />
                <Box>
                    <Text>
                        <strong>{record.title || record.params?.name || record.params?.key || `Record #${record.id}`}</strong>
                    </Text>
                </Box>
            </DrawerContent>
            <DrawerFooter>
                <Button variant="contained" size="lg" onClick={handleConfirm} disabled={loading}>
                    {loading ? <><Icon icon="Loader" spin /> Removing...</> : 'Confirm removal'}
                </Button>
            </DrawerFooter>
        </>
    );
};

export default CustomDeleteAction;
