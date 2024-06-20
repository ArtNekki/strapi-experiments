import React, {useEffect, useState} from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box, Checkbox, Typography, Flex, IconButton, Alert, Loader, Link } from '@strapi/design-system';
import { Pencil, Trash, Plus } from '@strapi/icons';
import axios from "../utils/axiosInstance";

const COL_COUNT = 5;
const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await axios.get('/github-projects/repos');
        setRepos(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <Alert closeLabel="Close" title="Error fetching repositories" variant="danger">
      {error.toString()}
    </Alert>
  }

  if (loading) return <Box marginLeft={'auto'} marginRight='auto'><Loader>Loading content...</Loader></Box>

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
          {repos.map((repo) => {
            const {id, name, shortDescription, url, projectId} = repo;

            return (
              <Tr key={id}>
                <Td>
                  <Checkbox aria-label={`Select ${id}`} />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{shortDescription}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={url} isExternal>{url}</Link>
                  </Typography>
                </Td>
                <Td>
                  {
                    projectId ?
                      (
                        <Flex>
                          <Link to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}>
                            <IconButton onClick={() => console.log('edit')} label="Edit" borderWidth={0} icon={<Pencil />} />
                          </Link>
                          <Box paddingLeft={1}>
                            <IconButton onClick={() => console.log('delete')} label="Delete" borderWidth={0} icon={<Trash />} />
                          </Box>
                        </Flex>
                      ) : (
                        <Box paddingLeft={1}>
                          <IconButton onClick={() => console.log('delete')} label="Add" borderWidth={0} icon={<Plus />} />
                        </Box>
                      )
                  }
                </Td>
              </Tr>
            )
        })}
        </Tbody>
      </Table>
    </Box>
  )
}

export default Repo;
