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
  const [newCourseStep, setNewCourseStep] = useState<0 | 1 | 2 | 3>(0);
  const [lessonTime, setLessonTime] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);

  return (
    <Box style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <ActionIcon
        onClick={() => setSideBarStatus((o) => !o)}
        size="xl"
        variant="default"
        style={{
          position: 'absolute',
          top: 11,
          left: 11,
          zIndex: 0,
          border: 'none',
        }}
      >
        <IconLayoutSidebarLeftExpand size={36}></IconLayoutSidebarLeftExpand>
      </ActionIcon>
      <Drawer
        opened={sideBarStatus}
        onClose={() => setSideBarStatus(false)}
        withCloseButton={false}
        size={280} // Mantine’s built-in width control
        styles={{
          content: {
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          },
          body: {
            padding: 'var(--mantine-spacing-md)', // Apply padding to body
            height: '100%', // Make body fill the drawer
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          root: { zIndex: 1 },
        }}
      >
        {/* User Info */}
        <Box>
          {isLoading && <Title order={4}>Loading...</Title>}
          {user && (
            <Box>
              <Box>
                <Flex style={{ alignItems: 'center', gap: 10 }}>
                  <Avatar color="cyan" radius="xl">
                    {user.name?.[0]}
                  </Avatar>
                  <div>
                    <Title order={5}>
                      {user.name?.substring(0, user.name.indexOf('@'))}
                    </Title>
                    <Text size="sm" color="dimmed">
                      {user.email}
                    </Text>
                  </div>
                </Flex>
              </Box>
            </Box>
          )}
          <Divider my={'md'}></Divider>
          {/* Course Session */}
          <Box>
            {navList.map((item, key) => (
              <NavLink
                key={key}
                href={item.href}
                label={item.label}
                leftSection={<IconHome size={16} stroke={1.5} />}
                rightSection={
                  <IconChevronRight
                    size={12}
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                pl={0}
                pr={0}
              ></NavLink>
            ))}
          </Box>
        </Box>
        {/* Log Out Button */}
        <Button
          component="a"
          href="/auth/logout?returnTo=http://localhost:3000"
          color="red"
          mt="xl"
          fullWidth
        >
          Log Out
        </Button>
      </Drawer>

      {/* Main Content */}
      <Center style={{ flex: 1, padding: 32 }}>
        {/* Add your main content here */}
        {newCourseStep == 0 && (
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
              onClick={() => {
                setIsFileProcessed((o) => !o);
                setNewCourseStep(1);
              }}
            >
              Start
            </Button>
          </Center>
        )}
        {newCourseStep == 1 && (
          <TableOfTopics
            topicJson={topicJson}
            setNewCourseStep={setNewCourseStep}
            leasonTime={lessonTime}
            setLessonTime={setLessonTime}
          />
        )}
      </Center>
    </Box>
  );
}
