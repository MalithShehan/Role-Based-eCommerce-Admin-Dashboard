import React, { useState } from 'react';
import { ApiClient } from 'adminjs';
import { Box, Button, Text, Icon, DrawerContent, DrawerFooter, MessageBox, Table, TableBody, TableRow, TableCell } from '@adminjs/design-system';

const api = new ApiClient();

const CustomBulkDeleteAction = (props) => {
    const { records, resource, action } = props;
    const [loading, setLoading] = useState(false);

    if (!records || !records.length) {
        return <Text>Pick some records first to remove.</Text>;
    }

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const recordIds = records.map((r) => r.id);
            await api.bulkAction({
                resourceId: resource.id,
                actionName: action.name,
                recordIds,
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
                    message={`Are you sure you want to remove ${records.length} record(s)?`}
                />
                <Table>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>
                                    {record.title || record.params?.name || record.params?.key || `#${record.id}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DrawerContent>
            <DrawerFooter>
                <Button variant="contained" size="lg" onClick={handleConfirm} disabled={loading}>
                    {loading ? <><Icon icon="Loader" spin /> Removing...</> : `Confirm removal (${records.length})`}
                </Button>
            </DrawerFooter>
        </>
    );
};

export default CustomBulkDeleteAction;
