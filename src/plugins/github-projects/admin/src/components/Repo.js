import React, {useEffect, useState} from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box, Checkbox, BaseCheckbox, Typography, Flex, IconButton, Alert, Loader, Link } from '@strapi/design-system';
import { Pencil, Trash, Plus } from '@strapi/icons';
import axios from "../utils/axiosInstance";

const COL_COUNT = 5;
const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [alert, setAlert] = useState(undefined)

  const allChecked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allChecked;

  const showAlert = (alert) => {
    setAlert(alert);

    setTimeout(() => {
      setAlert(undefined);
    }, 5000)
  }

  const createProject = async (repo) => {
    const response = await axios.post('/github-projects/project', repo);

    if (response && response.data) {
      setRepos(repos.map((item) => {
        return item.id !== repo.id ? item : {
          ...item,
          projectId: response.data.id
        };
      }));

      showAlert({
        title: "Project created",
        text: `Successfully created ${response.data.title}`,
        variant: "success"
      })
    } else {
      showAlert({
        title: "Error occured",
        text: `Oops something wrong, please retry`,
        variant: "danger"
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const result = await axios.get('/github-projects/repos');
        setRepos(result.data);
      } catch (error) {
        showAlert({
          title: "Error fetching repositories",
          text: error.toString(),
          variant: "danger"
        })
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Box marginLeft={'auto'} marginRight='auto'><Loader>Loading content...</Loader></Box>

  return (
    <Box padding={8} background="neutral100" width="100%">
      {alert && (
        <div style={{position: "absolute", top: 0, left: "15%", zIndex: 10}}>
          <Alert closeLabel="Close" title={alert.title} variant={alert.variant}>
            {alert.text}
          </Alert>
        </div>
      )}
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                aria-label="Select all entries"
                indeterminate={isIndeterminate}
                onValueChange={value => value ? setSelectedRepos(repos.map(repo => repo.id)) : setSelectedRepos([])}
                value={allChecked} />
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
                  <Checkbox aria-label={`Select ${id}`} value={selectedRepos.includes(id)} onValueChange={(value) => {
                    const newSelectedRepose = value
                      ? [...selectedRepos, id] : selectedRepos.filter((item) => item !== id)
                    setSelectedRepos(newSelectedRepose);
                  }} />
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
                          <IconButton onClick={() => createProject(repo)} label="Add" borderWidth={0} icon={<Plus />} />
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
