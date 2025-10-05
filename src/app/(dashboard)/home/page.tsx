'use client';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Center,
  Divider,
  Drawer,
  FileButton,
  Flex,
  NavLink,
  TableOfContents,
  Text,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import {
  IconChevronRight,
  IconHome,
  IconLayoutSidebarLeftExpand,
  IconUpload,
} from '@tabler/icons-react';
import TableOfTopics from '../../components/tableOfTopics';

const navList = [
  {
    href: '/home',
    label: 'Home',
  },
];
const topicJson = {
  topics: {
    entries: [
      {
        level: 1,
        page: 1,
        time: 42,
        title: 'Chapter 1: Europe in 1914',
      },
      {
        level: 1,
        page: 15,
        time: 36,
        title: 'Chapter 2: The Coming of War',
      },
      {
        level: 1,
        page: 27,
        time: 30,
        title: 'Chapter 3: 1914: The Opening Campaigns',
      },
      {
        level: 1,
        page: 37,
        time: 57,
        title: 'Chapter 4: 1915: The War Continues',
      },
      {
        level: 1,
        page: 56,
        time: 36,
        title: 'Chapter 5: 1916: The War of Attrition',
      },
      {
        level: 1,
        page: 68,
        time: 39,
        title: 'Chapter 6: The United States Enters the War',
      },
      {
        level: 1,
        page: 81,
        time: 42,
        title: 'Chapter 7: 1917: The Year of Crisis',
      },
      {
        level: 1,
        page: 95,
        time: 54,
        title: 'Chapter 8: 1918: The Year of Decision',
      },
      {
        level: 1,
        page: 113,
        time: 33,
        title: 'Chapter 9: The Settlement',
      },
    ],
    total_entries: 9,
  },
};
export default function Home() {
  const { user, isLoading } = useUser();
  const [sideBarStatus, setSideBarStatus] = useState<boolean>(false);
  const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);

  return (
    <Box style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}

      {/* Main Content */}
      <Center style={{ flex: 1, padding: 32 }}>
        {/* Add your main content here */}
        {/* {isFileProcessed ? ( */}
        {/* <TableOfTopics topicJson={topicJson}/> */}
        {/* ) : (
          <Center
            style={{
              width: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <Title>Start by uploading your text book</Title>
            <FileButton
              onChange={setFile}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            >
              {(props) => (
                <Button
                  variant="outline"
                  {...props}
                  size="xl"
                  h={200}
                  fullWidth
                  style={{
                    borderWidth: '2.5px',
                    borderRadius: '12px',
                  }}
                  color="dark"
                >
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    c={'dark'}
                  >
                    <IconUpload size={48} stroke={1.5} />
                    <Title order={3} fw={500}>
                      Upload
                    </Title>
                  </Box>
                </Button>
              )}
            </FileButton>
            {file && (
              <Text size="lg" ta="center">
                Picked file: {file.name}
              </Text>
            )}
            <Button
              fullWidth
              disabled={!file}
              onClick={() => setIsFileProcessed((o) => !o)}
            >
              Start
            </Button>
          </Center>
        )*/}
      </Center>
    </Box>
  );
}
