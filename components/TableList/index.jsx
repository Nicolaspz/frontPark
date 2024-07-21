import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbar,
  useGridApiRef,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';

const CustomDataGrid = ({ rows, columns, apiRef, components, fetchDataFn, onEdit, onDelete }) => {
  const [data, setData] = useState([]);
  const internalApiRef = useGridApiRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchDataFn();
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleEdit = () => {
    const selectedRows = apiRef?.current?.getSelectedRows() || internalApiRef.current.getSelectedRows();
    onEdit(selectedRows);
  };

  const handleDelete = () => {
    const selectedIds = apiRef?.current?.getSelectedRows().map((row) => row.id) || internalApiRef.current.getSelectedRows().map((row) => row.id);
    onDelete(selectedIds);
  };

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGrid
        rows={rows || data}
        columns={columns}
        apiRef={apiRef || internalApiRef}
        components={{
          Toolbar: () => (
            <GridToolbar>

            </GridToolbar>
          ),
          ...components,
        }}
        autoPageSize
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        
      />
    </Box>
  );
};

CustomDataGrid.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array.isRequired,
  apiRef: PropTypes.object,
  components: PropTypes.object,
  fetchDataFn: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CustomDataGrid;
