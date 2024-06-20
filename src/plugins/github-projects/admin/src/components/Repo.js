import React, {useEffect, useState} from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box, Checkbox, Typography, Flex, IconButton, Alert, Loader } from '@strapi/design-system';
import { Pencil, Trash } from '@strapi/icons';
import axios from "../utils/axiosInstance";

const COL_COUNT = 5;
const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await axios.get('/github-projects/repos')
        .then((result) => {
          return setRepos(result.data);
        })
        .catch((error) => {
          return setError(error);
        });
    };

    fetchData();

    setLoading(false);
  }, []);


  // useEffect(async () => {
  //   setLoading(true);
  //
  //   // axios
  //   //   .get('/github-projects/repos')
  //   //   .then((response) => {
  //   //     console.log('setRepos(response.data)', setRepos(response.data))
  //   //     return setRepos(response.data)
  //   //   })
  //   //   .catch((error) => {
  //   //     console.log('error', error);
  //   //     return setError(error);
  //   //   })
  //   setLoading(false);
  // });

  if (error) {
    return <Alert closeLabel="Close" title="Error fetching repositories" variant="danger">
      {error.toString()}
    </Alert>
  }

  if (loading) return <Loader>Loading content...</Loader>

  return (
    <Box padding={4} background="neutral100">
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox aria-label="Select all entries" />
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Url</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map(entry => <Tr key={entry.id}>
            <Td>
              <Checkbox aria-label={`Select ${entry.contact}`} />
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.name}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.shortDescription}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.url}</Typography>
            </Td>
            <Td>
              <Flex>
                <IconButton onClick={() => console.log('edit')} label="Edit" borderWidth={0}>
                  <Pencil />
                </IconButton>
                <Box paddingLeft={1}>
                  <IconButton onClick={() => console.log('delete')} label="Delete" borderWidth={0}>
                    <Trash />
                  </IconButton>
                </Box>
              </Flex>
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
    </Box>
  )
}

export default Repo;
