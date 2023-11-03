import React, { useEffect, useState } from 'react';
import { Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import { tasks } from '../../utils/mock-data/task';
import TaskListHead from '../../components/_dashboard/user/list/TaskListHead';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';



const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'staffId', label: 'Staff ID', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: '', alignRight: false },
];

function TaskList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((task) => task.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, taskId) => {
    const selectedIndex = selected.indexOf(taskId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, taskId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const sortedTasks = tasks.sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'id') {
      return (a.id - b.id) * (isAsc ? 1 : -1);
    }
    if (orderBy === 'staffId') {
      return isAsc ? a.staffId.localeCompare(b.staffId) : b.staffId.localeCompare(a.staffId);
    }
    if (orderBy === 'location') {
      return isAsc ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location);
    }
    if (orderBy === 'status') {
      return isAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) =>
    task.status.toLowerCase().includes(filterName.toLowerCase())
  );

  const isTaskNotFound = filteredTasks.length === 0;

  return (
    <Page title="Task: List">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs heading="Task" links={[{ name: 'List' }]} />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TaskListHead
                  headLabel={TABLE_HEAD}
                  rowCount={tasks.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredTasks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((task) => {
                      const { id, staffId, location, status } = task;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{staffId}</TableCell>
                          <TableCell align="left">{location}</TableCell>
                          <TableCell align="left">{status}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
                {isTaskNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={5} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery="No task available" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tasks.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default TaskList;
